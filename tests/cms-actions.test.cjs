const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const id = "11111111-1111-4111-8111-111111111111";

// Compile the actual TypeScript in memory; mock only external service boundaries.
function load(file, mocks) {
 const output = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
 const exports = {};
 vm.runInNewContext("(function(require,exports) {" + output + "\n})", { process, FormData, File, Uint8Array, URL, Date, console })(
  name => Object.hasOwn(mocks, name) ? mocks[name] : require(name), exports);
 return exports;
}
function harness(options = {}) {
 const writes = [], invalidated = [];
 const cms = load("src/lib/cms.ts", {});
 const supabase = { from(table) {
  let operation, values;
  const query = {
   insert(value) { operation="create"; values=value; return query; },
   update(value) { operation="update"; values=value; return query; },
   delete() { operation="delete"; return query; },
   eq(key, value) { assert.equal(key,"id"); assert.equal(value,id); return query; },
   async select() {
    writes.push({ table, operation, values });
    return options.databaseError ? { data:null, error:{ code:"42501" } } : { data:[{ id }], error:null };
   }
  };
  return query;
 } };
 const auth = { async requireAdmin() { if (options.denied) throw new Error("Access denied"); return { supabase, user:{ id } }; } };
 const mutation = load("src/lib/cms-mutations.ts", {
  "server-only": {}, "./cms": cms, "@/lib/admin": auth,
  "next/cache": { revalidatePath: path => invalidated.push(path), revalidateTag: tag => invalidated.push(tag) }
 });
 const actions = load("src/app/actions/admin.ts", { "@/lib/admin": auth, "@/lib/cms": cms, "@/lib/cms-mutations": mutation });
 return { cms, mutation, actions, writes, invalidated };
}
function form() {
 const value = new FormData();
 Object.entries({ title:"Test content", slug:"test-content", body:"Full content for testing", excerpt:"A test summary", status:"published", sort_order:"0", year:"2026", file_url:"/assets/officers/officers.pdf" }).forEach(([key,val]) => value.set(key,val));
 return value;
}
for (const [module, title] of Object.entries({ announcements:"Announcement", journalism:"Journalism", events:"Event", documents:"Document", achievements:"Achievement", officers:"Officer", merch:"Merch" })) {
 test(module + " create/update/delete use admin actions and invalidate public output", async () => {
  const h = harness();
  for (const operation of ["create","update","delete"]) {
   const data = form(); if(operation !== "create") data.set("id",id);
   const result = await h.actions[operation + title](data);
   assert.equal(result.success,true,result.message);
  }
  assert.deepEqual(h.writes.map(row=>row.operation),["create","update","delete"]);
  assert.ok(h.invalidated.includes(h.cms.modules[module].path));
  assert.ok(h.writes.every(row=>row.table===h.cms.modules[module].table));
  assert.equal(h.writes[0].values.created_by,id);
  assert.equal(h.writes[0].values.status,"published");
  assert.ok(h.writes[0].values.published_at);
  assert.equal(h.writes[1].values.created_by,undefined);
 });
}
test("anonymous/non-admin rejection happens before any write or upload", async () => {
 const h=harness({ denied:true });
 await assert.rejects(h.actions.createEvent(form()),/Access denied/);
 await assert.rejects(h.actions.prepareMediaUpload("events","image/jpeg",1024),/Access denied/);
 assert.equal(h.writes.length,0);
});
test("invalid module, invalid UUID and unsafe URLs cannot mutate content", async () => {
 const h=harness();
 assert.equal((await h.actions.saveContent("profiles",form())).success,false);
 const bad=form(); bad.set("id","not-a-uuid");
 assert.equal((await h.actions.updateEvent(bad)).success,false);
 const unsafe=form(); unsafe.set("image_url","javascript:alert(1)");
 assert.equal((await h.actions.createEvent(unsafe)).success,false);
 unsafe.set("image_url","/assets/../admin/private.jpg");
 assert.equal((await h.actions.createEvent(unsafe)).success,false);
 assert.equal(h.writes.length,0);
});
test("database denial reports failure and does not revalidate", async () => {
 const h=harness({databaseError:true});
 assert.equal((await h.actions.createEvent(form())).success,false);
 assert.equal(h.invalidated.length,0);
});
test("draft save removes publication and journal writes correct content", async () => {
 const h=harness(); const data=form(); data.set("status","draft");
 assert.equal((await h.actions.createJournalism(data)).success,true);
 assert.equal(h.writes[0].values.published_at,null);
 assert.equal(h.writes[0].values.content,data.get("body"));
});
test("bad event dates, years and media upload types fail validation", async () => {
 const h=harness(); const data=form(); data.set("starts_at","tomorrow");
 assert.equal((await h.actions.createEvent(data)).success,false);
 data.set("year","not a year");
 assert.equal((await h.actions.createAchievement(data)).success,false);
 assert.equal((await h.actions.prepareMediaUpload("events","image/svg+xml",100)).success,false);
 assert.equal((await h.actions.prepareMediaUpload("events","image/jpeg",52428801)).success,false);
 assert.equal(h.writes.length,0);
});


import type { Concept, Difficulty, Question } from "./data";

const question=(id:string,type:Question["type"],prompt:string,answer:string,page:number,module:string,explanation:string,choices?:string[],difficulty:Difficulty="medium"):Question=>({id,type,question:prompt,answer,sourcePage:page,module,explanation,choices,difficulty});
const l1="Introduction to Remote Sensing";
const l2="Physical Principles of Remote Sensing";
const l3="Energy Interactions with Earth Surface Features";

export const lesson1ChallengeExpansion:Question[]=[
 question("l1-x-mcq-1","mcq","Which platform is described as airborne?","Aircraft",14,l1,"Aircraft are listed as airborne platforms.",["Aircraft","Satellite","Space shuttle","Orbital sensor"]),
 question("l1-x-mcq-2","mcq","Which output can be created from stored remotely sensed values?","Images",21,l1,"The source explains that stored values are transformed into images.",["Images","Soil particles","Political boundaries","Sound waves"]),
 question("l1-x-identify-1","identify","The non-contact study of objects, areas, or phenomena is…","Remote sensing",4,l1,"This restates the lesson definition."),
 question("l1-x-identify-2","identify","A naturally occurring source used by passive sensing is the…","Sun",19,l1,"The Sun is identified as a passive source."),
 {id:"l1-visual-human-system",type:"identify",question:"Visual Fill-in: identify the main parts of the human visual remote-sensing system.",answer:"Human visual system",sourcePage:13,module:l1,difficulty:"medium",explanation:"The visual system receives reflected visible light from an object, then sends the visual signal to the brain.",visualFill:{image:"/lesson-1-human-visual-system.png",alt:"Human Visual System diagram showing the Sun, incident solar radiation, an object, reflected visible light, an eye, and a signal to the brain.",prompts:[{label:"Energy source",answer:"Sun",hint:"It provides the incident solar radiation."},{label:"Target being observed",answer:"Object",hint:"It reflects visible light toward the eye."},{label:"Receiving sensor organ",answer:"Eye",hint:"It receives the reflected visible light."},{label:"Final interpretation destination",answer:"Brain",hint:"The visual signal is processed here."}]}},
 question("l1-x-tf-1","tf","GIS can be used to analyze and visualize spatial data collected through remote sensing.","true",8,l1,"The remote sensing and GIS comparison makes this distinction."),
 question("l1-x-tf-2","tf","An active remote-sensing system waits only for natural solar illumination.","false",23,l1,"Active systems emit their own radiation."),
 question("l1-x-number-1","number","According to the source deck, ArcMap support ends after March 1, ___.","2026",31,l1,"The source deck gives 2026."),
 question("l1-x-number-2","number","Remote sensing records an entire area at a point in ___.","Time",18,l1,"The lesson states that the record is time-specific."),
 question("l1-x-classify-1","classify","Classify a satellite platform as airborne or spaceborne.","Spaceborne",14,l1,"Satellites are spaceborne platforms."),
 question("l1-x-classify-2","classify","Classify a lamp that illuminates a target as a passive or active energy source.","Active",19,l1,"Lamps are listed among active sources."),
 question("l1-x-boss-1","boss","Boss: A study needs imagery of a dangerous, inaccessible area without disturbing the resource. Which advantage best fits?","Rapid, unobtrusive large-area observation",24,l1,"The lesson names non-interference and access to difficult locations as strengths.",["Rapid, unobtrusive large-area observation","Guaranteed zero error","No need for interpretation","Only small-area sampling"],"hard"),
 question("l1-x-boss-2","boss","Boss: A system sends microwave energy toward terrain and analyzes the return. What kind of system is it?","Active system",23,l1,"It supplies its own energy and records the altered return.",["Active system","Passive system","GIS layer","Map layout"],"hard"),
 question("l1-x-boss-3","boss","Boss: Choose the correct workflow after reflected energy reaches a sensor.","Quantize and store values, then transform them into images",20,l1,"This is the process sequence given in the lesson.",["Quantize and store values, then transform them into images","Create a legend before measuring","Transmit energy through soil","Remove all calibration checks"],"expert")
];

export const lesson2ChallengeExpansion:Question[]=[
 question("l2-x-mcq-1","mcq","Which atmospheric effect redirects radiation in all directions?","Scattering",69,l2,"Scattering disperses radiation in all directions.",["Scattering","Refraction","Irradiance","Transmission"]),
 question("l2-x-mcq-2","mcq","Which body has emissivity equal to 1?","Black body",38,l2,"A black body is the perfect emitter/absorber in the lesson.",["Black body","White body","Gray body","Atmospheric window"]),
 question("l2-x-identify-1","identify","The energy per second emitted, received, or transferred is called…","Radiant power",33,l2,"Radiant power is measured in watts."),
 question("l2-x-identify-2","identify","The law relating peak emission wavelength to temperature is…","Wien's displacement law",40,l2,"Wien's law gives λmax = A/T."),
 question("l2-x-tf-1","tf","The Sun can be detected as a source of solar radiation only during daylight.","true",51,l2,"The lesson contrasts daylight solar radiation with day-and-night terrestrial radiation."),
 question("l2-x-tf-2","tf","Mie scattering is caused only by particles much smaller than a wavelength.","false",75,l2,"Mie particles are approximately comparable to wavelength."),
 question("l2-x-number-1","number","The speed of light used in the lesson is approximately 3 × 10^___ m/s.","8",14,l2,"The source states 3 × 10⁸ m/s."),
 question("l2-x-number-2","number","The visible region is approximately 0.4 to ___ µm.","0.7",26,l2,"The visible interval is about 0.4-0.7 µm."),
 question("l2-x-classify-1","classify","Classify a 1 m wavelength within the remote-sensing spectrum region used in the lesson.","Microwave",29,l2,"Microwave spans approximately 0.1 mm to 1 m."),
 question("l2-x-classify-2","classify","Classify scattering from very large cloud droplets (d > 10λ).","Non-selective scattering",76,l2,"Large particles create non-selective scattering."),
 question("l2-x-boss-1","boss","Boss: A material must be observed through an atmospheric region that transmits EMR relatively well. What should the sensor use?","An atmospheric window",61,l2,"Sensors operate in relatively transparent atmospheric windows.",["An atmospheric window","An opaque absorption band","Only high-energy UV","A calibration drift"],"hard"),
 question("l2-x-boss-2","boss","Boss: Blue sky is most directly explained by which combination?","Rayleigh scattering and stronger scattering of blue light",71,l2,"Rayleigh scattering affects blue light about 4-5 times more than red.",["Rayleigh scattering and stronger scattering of blue light","Mie scattering and red absorption","Non-selective scattering only","Thermal emission from soil"],"hard"),
 question("l2-x-boss-3","boss","Boss: Which sequence correctly orders EMR regions from shorter to longer wavelength?","Visible, infrared, microwave",23,l2,"The remote-sensing regions progress from visible through IR to microwave.",["Visible, infrared, microwave","Microwave, infrared, visible","Infrared, visible, microwave","Microwave, visible, infrared"],"expert")
];

export const lesson3ConceptExpansion:Concept[]=[
 {id:"l3-vegetation-ratio",module:l3,topic:l3,term:"Vegetation NIR/red ratio",definition:"Vegetation can be mapped with the simple NIR/R ratio; it works best for green broad-leaved plants and less well for forest or conifers.",facts:["Species mapping depends on leaf and canopy structure.","Major groups such as forest and grass are easier to distinguish than differences within a group."],sourcePage:26,difficulty:"hard",tags:["Lesson 3",l3,"vegetation","NIR/R"]},
 {id:"l3-water-depth",module:l3,topic:l3,term:"Water-depth response",definition:"Different visible-to-near-infrared bands provide different potential depths of water detection, with longer bands reaching progressively shallower depths.",facts:["The source lists 10 m at 0.5-0.6 µm, 3 m at 0.6-0.7 µm, 1 m at 0.7-0.8 µm, and 10 cm at 0.8-1.1 µm."],sourcePage:44,difficulty:"hard",tags:["Lesson 3",l3,"water","depth"]},
 {id:"l3-water-sediment",module:l3,topic:l3,term:"Suspended sediment",definition:"Suspended sediment in upper water layers increases reflectivity and brightness and shifts apparent color slightly toward longer wavelengths.",facts:["It can be confused with shallow clear water in imagery."],sourcePage:45,difficulty:"medium",tags:["Lesson 3",l3,"water","sediment"]},
 {id:"l3-water-algae",module:l3,topic:l3,term:"Algal chlorophyll in water",definition:"Algal chlorophyll absorbs more blue light and reflects green, making water appear greener when algae is present.",facts:["Surface roughness and floating material can complicate interpretation through specular effects."],sourcePage:46,difficulty:"medium",tags:["Lesson 3",l3,"water","algae"]},
 {id:"l3-soil-iron",module:l3,topic:l3,term:"Iron oxide in soil",definition:"Higher iron-oxide content lowers soil reflectance, particularly in the visible region.",facts:["Iron oxide is commonly rust and contributes red and yellow colors to soils and rocks."],sourcePage:40,difficulty:"medium",tags:["Lesson 3",l3,"soil","iron oxide"]},
 {id:"l3-separability",module:l3,topic:l3,term:"Spectral-band redundancy",definition:"Correlated spectral bands may provide redundant information; selecting the most discriminating bands reduces dimensionality and later classification cost.",facts:["Assess separability for the specific land-cover and land-use classes being classified."],sourcePage:57,difficulty:"hard",tags:["Lesson 3",l3,"spectral resolution","classification"]}
];

export const lesson3ChallengeExpansion:Question[]=[
 question("l3-x-mcq-1","mcq","The NIR/R vegetation ratio works best for which plants?","Green broad-leaved plants",26,l3,"The lesson says the simple ratio works best for green, broad-leaved plants.",["Green broad-leaved plants","Conifers only","All forest types equally","Bare rock"]),
 question("l3-x-mcq-2","mcq","Which factor can make water brighter in an image?","Suspended sediment",45,l3,"Suspended sediment improves reflectivity and brightness.",["Suspended sediment","Greater NIR absorption","No water depth","Lower turbidity only"]),
 question("l3-x-identify-1","identify","The green appearance of algae-rich water is mainly due to…","Chlorophyll",46,l3,"Algal chlorophyll absorbs blue and reflects green."),
 question("l3-x-identify-2","identify","The use of hundreds of close, narrow spectral bands is called…","Hyperspectral analysis",56,l3,"The lesson names image spectroscopy or hyperspectral analysis."),
 question("l3-x-tf-1","tf","The NIR/R vegetation ratio works equally well for conifers and broad-leaved plants.","false",26,l3,"The source says it does not work at all for conifers."),
 question("l3-x-tf-2","tf","Higher iron oxide generally lowers soil reflectance, particularly in visible wavelengths.","true",40,l3,"This is the stated iron-oxide effect."),
 question("l3-x-number-1","number","The source lists a potential water depth of ___ m for the 0.6-0.7 µm band.","3",44,l3,"The listed depth is 3 m."),
 question("l3-x-number-2","number","The additive leaf-stacking effect is significant up to ___ leaf layers.","6",33,l3,"The source gives six leaf layers."),
 question("l3-x-classify-1","classify","Classify a sensor that samples a limited number of discrete spectral bands.","Multispectral",53,l3,"Multispectral systems operate in a limited number of discrete bands."),
 question("l3-x-classify-2","classify","Classify a smooth mirror-like surface that redirects energy in one direction.","Specular",8,l3,"This is the definition of a specular surface."),
 question("l3-x-boss-1","boss","Boss: A pixel is bright because suspended sediment is present, but it resembles another condition. What is the likely confusion?","Shallow clear water",45,l3,"The source says sediment can be confused with shallow, clear water.",["Shallow clear water","Deep NIR water","Dense vegetation","A black body"],"hard"),
 question("l3-x-boss-2","boss","Boss: You need to distinguish similar rock types that broad visible/IR bands cannot separate. What improvement is needed?","Higher spectral resolution",56,l3,"Similar classes require finer wavelength intervals.",["Higher spectral resolution","Lower spatial resolution","Fewer broad bands","A smoother soil surface"],"hard"),
 question("l3-x-boss-3","boss","Boss: Select the strongest explanation for very high healthy-leaf NIR reflectance.","Internal leaf-cell structure",23,l3,"The source identifies internal cell structure as the main NIR control.",["Internal leaf-cell structure","Red chlorophyll absorption only","Water turbidity","Iron oxide"],"expert")
];

const l4="Sensors, Platforms & Orbits";
export const lesson4ChallengeExpansion:Question[]=[
 question("l4-x-mcq-1","mcq","Which platform carries or supports a sensor?","Platform",4,l4,"The Lesson 4 definition says a platform supports or carries a sensor.",["Platform","Radiance","Pixel","Albedo"]),
 question("l4-x-mcq-2","mcq","Which orbit provides a constant view of part of Earth?","Geostationary orbit",7,l4,"A geostationary/geosynchronous orbit appears stationary over part of Earth.",["Geostationary orbit","Polar orbit only","Circular scanning","Pushbroom array"]),
 question("l4-x-identify-1","identify","A scanning system with a narrow IFOV that builds a two-dimensional image is a…","Scanning system",13,l4,"The Lesson 4 scanner definition uses a narrow IFOV."),
 question("l4-x-identify-2","identify","The ability to record fine wavelength intervals is…","Spectral resolution",24,l4,"This is the Lesson 4 definition of spectral resolution."),
 question("l4-x-tf-1","tf","A pushbroom sensor uses a linear detector array and platform motion to form scan lines.","true",15,l4,"The source describes pushbroom imaging this way."),
 question("l4-x-tf-2","tf","Temporal resolution describes the size of the smallest resolvable ground object.","false",30,l4,"That is spatial resolution; temporal resolution is revisit frequency."),
 question("l4-x-number-1","number","Landsat 8 quantization listed in the lesson is ___ bit.","12",44,l4,"The source gives 12-bit quantization."),
 question("l4-x-number-2","number","Landsat MSS ground resolution in the lesson is ___ m.","80",32,l4,"The Lesson 4 MSS slide gives 80 m."),
 question("l4-x-classify-1","classify","Classify a sensor using its own illumination energy source.","Active",6,l4,"Lesson 4 categorizes sensors as active or passive by energy source."),
 question("l4-x-classify-2","classify","Classify a satellite that crosses near the poles and revisits locations after several days.","Polar/Sun-synchronous orbit",8,l4,"The lesson gives this orbit description."),
 question("l4-x-boss-1","boss","Boss: You need the smallest resolvable ground object size. Which resolution should you compare?","Spatial resolution",22,l4,"Spatial resolution measures the smallest resolvable ground object.",["Spatial resolution","Temporal resolution","Radiometric resolution","Spectral signature"],"hard"),
 question("l4-x-boss-2","boss","Boss: A mission needs a sensor that appears stationary relative to Earth. Which orbit is appropriate?","Geostationary/Geosynchronous orbit",7,l4,"This orbit is synchronous with Earth rotation.",["Geostationary/Geosynchronous orbit","Polar/Sun-synchronous orbit","Circular scan path","Side scan mode"],"hard"),
 question("l4-x-boss-3","boss","Boss: Which instrument measures radiation intensity across many very narrow contiguous bands?","Spectroradiometer",3,l4,"A spectroradiometer is listed as a sensor; it samples detailed spectral information.",["Spectroradiometer","Balloon","Ship","Platform"],"expert")
];

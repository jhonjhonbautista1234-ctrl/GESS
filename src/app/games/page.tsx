import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import SurveyQuest from "@/features/games/survey-quest";
import "./games.css";

export const metadata: Metadata = {
  title: "Survey Quest",
  description: "Learn basic surveying through free interactive missions: coordinates, sonar depths, elevations, and contours. No sign-in needed.",
};

export default function GamesPage() {
  return <><SiteHeader /><SurveyQuest /></>;
}

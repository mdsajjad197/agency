'use server';
/**
 * @fileOverview A GenAI flow that refines a client's vague project idea into a structured concept.
 *
 * - refineProjectConcept - A function that handles the project concept refinement process.
 * - ProjectConceptRefinerInput - The input type for the refineProjectConcept function.
 * - ProjectConceptRefinerOutput - The return type for the refineProjectConcept function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const ProjectConceptRefinerInputSchema = z.object({
  initialConcept: z.string().describe('A vague initial idea for a website project.'),
});
export type ProjectConceptRefinerInput = z.infer<typeof ProjectConceptRefinerInputSchema>;

// Output Schema
const ProjectConceptRefinerOutputSchema = z.object({
  projectName: z.string().describe('A suggested name for the project based on the initial concept.'),
  projectType: z.string().describe('The primary type of website (e.g., "E-commerce Platform", "Business Landing Page", "Portfolio Site", "Blog", "Custom Web Application", "Informational Website").'),
  targetAudience: z.string().describe('Description of the intended users for the website.'),
  coreFeatures: z.array(z.string()).describe('A list of essential functionalities and features required for the website.'),
  mainGoals: z.array(z.string()).describe('A list of primary objectives the website aims to achieve (e.g., "Generate leads", "Sell products", "Showcase portfolio", "Provide information", "Build brand awareness").'),
  designPreferences: z.string().describe('Any specific design styles or preferences mentioned, or suggested based on common practices (e.g., "minimalist", "modern", "corporate", "playful", "elegant", "user-friendly").'),
  callToAction: z.string().describe('The main desired action for users visiting the website (e.g., "Contact Us", "Buy Now", "Explore Portfolio", "Sign Up").'),
  additionalNotes: z.string().optional().describe('Any other relevant details or considerations that emerged during refinement.'),
});
export type ProjectConceptRefinerOutput = z.infer<typeof ProjectConceptRefinerOutputSchema>;

// Wrapper function
export async function refineProjectConcept(
  input: ProjectConceptRefinerInput
): Promise<ProjectConceptRefinerOutput> {
  return aiProjectConceptRefinerFlow(input);
}

// Prompt definition
const projectRefinerPrompt = ai.definePrompt({
  name: 'projectRefinerPrompt',
  input: { schema: ProjectConceptRefinerInputSchema },
  output: { schema: ProjectConceptRefinerOutputSchema },
  prompt: `You are an AI-powered project concept refiner for SS Studio. Your goal is to help prospective clients with vague website ideas articulate their needs clearly and comprehensively.

Given a client's initial concept, refine it into a structured project brief using the provided output schema.
Carefully read the "Initial Project Concept" and extract or infer the following details to populate the JSON output:

- projectName: Suggest a concise and relevant name for the project.
- projectType: Identify the main category of the website.
- targetAudience: Describe who the website is for.
- coreFeatures: List the essential functionalities.
- mainGoals: Outline the primary objectives the website needs to achieve.
- designPreferences: Note any aesthetic styles or user experience priorities.
- callToAction: Determine the key action you want visitors to take.
- additionalNotes: Include any other important details or assumptions.

If details are not explicitly provided in the initial concept, make reasonable, professional suggestions based on common website project requirements and best practices.

Initial Project Concept: {{{initialConcept}}}`,
});

// Flow definition
const aiProjectConceptRefinerFlow = ai.defineFlow(
  {
    name: 'aiProjectConceptRefinerFlow',
    inputSchema: ProjectConceptRefinerInputSchema,
    outputSchema: ProjectConceptRefinerOutputSchema,
  },
  async (input) => {
    const { output } = await projectRefinerPrompt(input);
    return output!;
  }
);

// src/ai/flows/generate-photo-tags.ts
'use server';

/**
 * @fileOverview AI-powered photo tag generator.
 *
 * This file defines a Genkit flow that automatically generates relevant tags
 * for uploaded photos using AI. It includes the flow definition, input/output
 * schemas, and prompt configuration.
 *
 * @exports generatePhotoTags - The main function to generate photo tags.
 * @exports GeneratePhotoTagsInput - The input type for the generatePhotoTags function.
 * @exports GeneratePhotoTagsOutput - The output type for the generatePhotoTags function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Define the input schema for the photo tag generation flow.
const GeneratePhotoTagsInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the uploaded photo.'),
  description: z.string().optional().describe('Optional description of the photo.'),
});
export type GeneratePhotoTagsInput = z.infer<typeof GeneratePhotoTagsInputSchema>;

// Define the output schema for the photo tag generation flow.
const GeneratePhotoTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of relevant tags for the photo.'),
});
export type GeneratePhotoTagsOutput = z.infer<typeof GeneratePhotoTagsOutputSchema>;

// Exported function to generate photo tags.
export async function generatePhotoTags(input: GeneratePhotoTagsInput): Promise<GeneratePhotoTagsOutput> {
  return generatePhotoTagsFlow(input);
}

// Define the prompt for generating photo tags.
const generatePhotoTagsPrompt = ai.definePrompt({
  name: 'generatePhotoTagsPrompt',
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the uploaded photo.'),
      description: z.string().optional().describe('Optional description of the photo.'),
    }),
  },
  output: {
    schema: z.object({
      tags: z.array(z.string()).describe('An array of relevant tags for the photo.'),
    }),
  },
  prompt: `You are an AI expert in image recognition and tagging.
  Analyze the photo at the given URL and generate a list of relevant tags for it.
  Consider objects, scenes, and concepts present in the image.
  Return only tags in array format.
  If a description is available, use it as additional context to provide the most accurate tags.

  Photo URL: {{photoUrl}}
  Description: {{description}}

  Tags:`,
});

// Define the Genkit flow for generating photo tags.
const generatePhotoTagsFlow = ai.defineFlow<
  typeof GeneratePhotoTagsInputSchema,
  typeof GeneratePhotoTagsOutputSchema
>(
  {
    name: 'generatePhotoTagsFlow',
    inputSchema: GeneratePhotoTagsInputSchema,
    outputSchema: GeneratePhotoTagsOutputSchema,
  },
  async input => {
    const {output} = await generatePhotoTagsPrompt(input);
    return output!;
  }
);

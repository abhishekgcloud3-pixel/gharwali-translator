import { NextRequest, NextResponse } from 'next/server';
import { contributionSchema } from '@/lib/validations/contribution';
import type { Contribution } from '@/types/contribution';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'contributions.json');

function ensureDataFileExists() {
  const dataDir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([], null, 2));
  }
}

function readContributions(): Contribution[] {
  ensureDataFileExists();
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveContributions(contributions: Contribution[]): void {
  ensureDataFileExists();
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(contributions, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation with Zod
    const validationResult = contributionSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten();
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors.fieldErrors,
        },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Create contribution object
    const contribution: Contribution = {
      id: `contrib_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      garhwaliWord: formData.garhwaliWord.trim(),
      hindiMeaning: formData.hindiMeaning.trim(),
      englishMeaning: formData.englishMeaning.trim(),
      usageExample: formData.usageExample?.trim() || undefined,
      contributorName: formData.contributorName?.trim() || undefined,
      contributorEmail: formData.contributorEmail?.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };

    // Read existing contributions
    const contributions = readContributions();

    // Add new contribution
    contributions.unshift(contribution);

    // Save to file
    saveContributions(contributions);

    return NextResponse.json(
      {
        success: true,
        message: 'Contribution submitted successfully!',
        data: {
          id: contribution.id,
          submittedAt: contribution.submittedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing contribution:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your submission. Please try again.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contributions = readContributions();
    return NextResponse.json({
      success: true,
      data: contributions,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve contributions',
      },
      { status: 500 }
    );
  }
}

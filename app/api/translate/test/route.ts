import { NextRequest, NextResponse } from 'next/server';
import { translationSchema } from '@/lib/validations/contribution';
import { TranslationEngine } from '@/lib/translationEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = translationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { text, target_lang } = validationResult.data;
    const engine = new TranslationEngine();

    const result = engine.translateText(text, target_lang);
    const stats = engine.getDictionaryStats();

    return NextResponse.json({
      success: true,
      input: text,
      translation: result.translation,
      target_lang,
      metadata: result.metadata,
      dictionary_stats: stats,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Translation failed',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const engine = new TranslationEngine();
  const stats = engine.getDictionaryStats();

  return NextResponse.json({
    success: true,
    message: 'Test translation endpoint',
    usage: {
      method: 'POST',
      body: {
        text: 'string (Garhwali text)',
        target_lang: 'hindi | english',
      },
    },
    dictionary_stats: stats,
  });
}

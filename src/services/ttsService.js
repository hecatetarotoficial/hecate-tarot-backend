const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder' });

/**
 * Genera audio (Buffer, formato mp3) a partir de un texto, usando el proveedor
 * configurado en TTS_PROVIDER.
 *
 * Proveedores disponibles ahora mismo:
 *  - "openai"      -> buena calidad, sencillo de configurar (solo necesitas OPENAI_API_KEY).
 *  - "elevenlabs"  -> la voz más realista/natural de las dos; requiere cuenta en
 *                     https://elevenlabs.io (tiene plan gratuito limitado para probar).
 *
 * Para añadir otro proveedor (Google Cloud TTS, Azure Speech, etc.):
 *  1. Añade tus credenciales en .env
 *  2. Implementa una función "generateWithX(text)" en este archivo
 *  3. Añade el caso correspondiente en el switch de generateSpeech()
 */
async function generateSpeech(text, { voice, model } = {}) {
  const provider = process.env.TTS_PROVIDER || 'openai';

  switch (provider) {
    case 'openai':
      return generateWithOpenAI(text, { voice, model });
    case 'elevenlabs':
      return generateWithElevenLabs(text, { voice });
    default:
      throw new Error(`Proveedor de TTS no soportado: ${provider}`);
  }
}

async function generateWithOpenAI(text, { voice, model } = {}) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('xxxx')) {
    throw new Error(
      'OPENAI_API_KEY no está configurada. Añádela a tu .env para poder generar audio real. ' +
      'Mientras tanto, la app puede usar la voz nativa del dispositivo (expo-speech) como alternativa gratuita.'
    );
  }

  // "tts-1-hd" suena notablemente más natural que "tts-1" (algo más lento de generar).
  const response = await openai.audio.speech.create({
    model: model || process.env.OPENAI_TTS_MODEL || 'tts-1-hd',
    voice: voice || process.env.OPENAI_TTS_VOICE || 'nova',
    input: text,
    format: 'mp3',
  });

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function generateWithElevenLabs(text, { voice } = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey.includes('xxxx')) {
    throw new Error(
      'ELEVENLABS_API_KEY no está configurada. Crea una cuenta en https://elevenlabs.io, ' +
      'copia tu API key en el .env y vuelve a intentarlo.'
    );
  }

  const voiceId = voice || process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
  const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`ElevenLabs devolvió un error (${res.status}): ${errorBody.slice(0, 300)}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = { generateSpeech };

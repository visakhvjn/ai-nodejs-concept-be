import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv'; // Added import for dotenv

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use API key from environment variables
});

app.get('/concept', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
            You are supposed to teach NodeJs concepts to the viewer. 
            Every time you are asked you will send a unique concept so that the viewer can revise his knowledge or learn something new.

            **DO NOT** return anything except the concept.

            Return it as HTML with clean formatting. For e.g.
            - <p> should have new lines after them.
            - Headings should have new line after them.
            - Only send JavaScript code in <pre><code> tags.
            - Code blocks should have new line after them.
            - Code should be in <pre><code> tags.
            - Do not return any other text.
          `,
        },
        {
          role: 'user',
          content: 'Can you teach me something about NodeJs?',
        },
      ],
      model: 'gpt-4o-mini',
    });

    // remove backticks
    const content = response.choices[0].message.content.replace(/```html/g, '');
    res.setHeader('Content-Type', 'text/html');
    res.end(content);
  } catch (error) {
    console.error('Error fetching concept:', error);
    res.status(500).json({ error: 'Failed to fetch concept' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
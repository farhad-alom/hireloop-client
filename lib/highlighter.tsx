import * as React from "react"
import {
  createHighlighter,
  type BundledLanguage,
  type GrammarState,
  type Highlighter,
  type ThemedToken,
} from "shiki"

const THEMES = { light: "github-light", dark: "github-dark" } as const

let instance: Promise<Highlighter> | null = null

function getHighlighter() {
  instance ??= createHighlighter({
    themes: [THEMES.light, THEMES.dark],
    langs: [],
  })
  return instance
}

function renderLine(tokens: ThemedToken[]): React.ReactNode {
  return tokens.map((token, i) => (
    <span key={i} style={token.htmlStyle as React.CSSProperties}>
      {token.content}
    </span>
  ))
}

/** Loads the language, then returns an object that highlights code line by line. */
export async function loadHighlighter(language: string) {
  const shiki = await getHighlighter()
  const lang = language as BundledLanguage

  if (!shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(lang)
  }

  return {
    highlight(code: string, state?: GrammarState) {
      const result = shiki.codeToTokens(code, {
        lang,
        themes: THEMES,
        defaultColor: false,
        grammarState: state,
      })

      return {
        lines: result.tokens.map(renderLine),
        state: result.grammarState,
      }
    },
  }
}

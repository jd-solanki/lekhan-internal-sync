/* eslint-disable regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group */
/*
  Remark plugin to include code snippets from external files with VS Code region support

  Inspired from VitePress's snippet plugin: https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/snippet.ts
*/
import type { Code, Root } from 'mdast'
import type { Plugin } from 'unified'
import type { VFile } from 'vfile'
import path from 'node:path'
import fs from 'fs-extra'

interface RegionMarker {
  start: RegExp
  end: RegExp
}

interface RegionData {
  re: RegionMarker
  start: number
  end: number
}

interface ParsedPath {
  filepath: string
  extension: string
  region: string
  lines: string
  lang: string
  attrs: string
  title: string
}

interface RemarkImportSnippetPluginOptions {
  rootDir?: string
}

const rawPathRegexp
  = /^(.+?(?:\.([a-z0-9]+))?)(#[\w-]+)?(?: ?\{(\d+(?:[,-]\d+)*)? ?(\S+)? ?(\S+)?\})? ?(?:\[(.+)\])?$/

const markers: RegionMarker[] = [
  {
    start: /^\s*\/\/\s*#?region\b\s*(.*?)\s*$/,
    end: /^\s*\/\/\s*#?endregion\b\s*(.*?)\s*$/,
  },
  {
    start: /^\s*<!--\s*#?region\b\s*(.*?)\s*-->/,
    end: /^\s*<!--\s*#?endregion\b\s*(.*?)\s*-->/,
  },
  {
    start: /^\s*\/\*\s*#region\b\s*(.*?)\s*\*\//,
    end: /^\s*\/\*\s*#endregion\b\s*(.*?)\s*\*\//,
  },
  {
    start: /^\s*#[rR]egion\b\s*(.*?)\s*$/,
    end: /^\s*#[eE]nd ?[rR]egion\b\s*(.*?)\s*$/,
  },
  {
    start: /^\s*#\s*#?region\b\s*(.*?)\s*$/,
    end: /^\s*#\s*#?endregion\b\s*(.*?)\s*$/,
  },
  {
    start: /^\s*(?:--|::|@?REM)\s*#region\b\s*(.*?)\s*$/,
    end: /^\s*(?:--|::|@?REM)\s*#endregion\b\s*(.*?)\s*$/,
  },
  {
    start: /^\s*#pragma\s+region\b\s*(.*?)\s*$/,
    end: /^\s*#pragma\s+endregion\b\s*(.*?)\s*$/,
  },
  {
    start: /^\s*\(\*\s*#region\b\s*(.*?)\s*\*\)/,
    end: /^\s*\(\*\s*#endregion\b\s*(.*?)\s*\*\)/,
  },
]

function dedent(text: string): string {
  const lines = text.split('\n')
  const minIndentLength = lines.reduce((acc, line) => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== ' ' && line[i] !== '\t')
        return Math.min(i, acc)
    }
    return acc
  }, Infinity)

  if (minIndentLength < Infinity) {
    return lines.map(x => x.slice(minIndentLength)).join('\n')
  }
  return text
}

function findRegion(lines: string[], regionName: string): RegionData | null {
  let chosen: Omit<RegionData, 'end'> | null = null

  for (let i = 0; i < lines.length; i++) {
    for (const re of markers) {
      if (re.start.exec(lines[i])?.[1] === regionName) {
        chosen = { re, start: i + 1 }
        break
      }
    }
    if (chosen)
      break
  }

  if (!chosen)
    return null

  let counter = 1
  for (let i = chosen.start; i < lines.length; i++) {
    if (chosen.re.start.exec(lines[i])?.[1] === regionName) {
      counter++
      continue
    }
    const endRegion = chosen.re.end.exec(lines[i])?.[1]
    if (endRegion === regionName || endRegion === '') {
      if (--counter === 0)
        return { ...chosen, end: i }
    }
  }

  return null
}

function rawPathToToken(rawPath: string): ParsedPath | null {
  const match = rawPathRegexp.exec(rawPath)
  if (!match)
    return null

  const [
    ,
    filepath = '',
    extension = '',
    region = '',
    lines = '',
    lang = '',
    attrs = '',
    rawTitle = '',
  ] = match

  const title = rawTitle || filepath.split('/').pop() || ''
  return { filepath, extension, region, lines, lang, attrs, title }
}

function visitTree(node: any, visitor: (node: any) => void): void {
  if (!node)
    return
  visitor(node)
  if (node.children) {
    node.children.forEach((child: any) => visitTree(child, visitor))
  }
}

const remarkImportSnippetPlugin: Plugin<[RemarkImportSnippetPluginOptions?], Root> = (options = {}) => {
  const rootDir = options.rootDir || process.cwd()

  return (tree: Root, file: VFile) => {
    visitTree(tree, (node: any) => {
      if (node.type !== 'code' || !node.meta?.startsWith('<<<'))
        return

      const codeNode = node as Code
      const rawPath = codeNode.meta!.slice(3).trim().replace(/^@/, rootDir)
      const parsed = rawPathToToken(rawPath)

      if (!parsed) {
        codeNode.value = `Invalid snippet path: ${rawPath}`
        return
      }

      const { filepath, extension, region, lines, lang, title } = parsed
      const fileDir = path.dirname(file.path || file.history?.[0] || rootDir)
      const resolvedPath = path.resolve(fileDir, filepath)

      if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
        codeNode.value = `Code snippet path not found: ${resolvedPath}`
        codeNode.lang = null
        return
      }

      let content = fs.readFileSync(resolvedPath, 'utf8').replace(/\r\n/g, '\n')

      if (region) {
        const regionName = region.slice(1)
        const contentLines = content.split('\n')
        const regionData = findRegion(contentLines, regionName)

        if (regionData) {
          content = dedent(
            contentLines
              .slice(regionData.start, regionData.end)
              .filter(l => !(regionData.re.start.test(l) || regionData.re.end.test(l)))
              .join('\n'),
          )
        }
      }

      codeNode.value = content
      codeNode.lang = lang || extension || codeNode.lang || null

      const metaParts: string[] = []
      if (lines)
        metaParts.push(`{${lines}}`)
      if (title)
        metaParts.push(`[${title}]`)
      codeNode.meta = metaParts.join(' ') || null
    })
  }
}

export default remarkImportSnippetPlugin

#!/usr/bin/env tsx

import { exec } from 'node:child_process'
import { access, mkdir } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'

const execAsync = promisify(exec)

interface ConversionOptions {
  theme?: string
  backgroundColor?: string
  outputDir?: string
}

/**
 * Generate SVG files from Mermaid diagrams
 * @param files Array of .mmd or .mermaid file paths
 * @param options Conversion options
 */
async function generateMermaidSVGs(files: string[], options: ConversionOptions = {}) {
  const {
    theme = 'neutral',
    backgroundColor = 'transparent',
    outputDir
  } = options

  consola.info(`🎨 Generating SVG files for ${files.length} Mermaid diagram(s)...`)

  const results = {
    success: [] as string[],
    failed: [] as { file: string, error: string }[]
  }

  for (const file of files) {
    try {
      const resolvedFile = resolve(file)
      
      // Check if file exists
      await access(resolvedFile)
      
      // Validate file extension
      const ext = extname(resolvedFile)
      if (!['.mmd', '.mermaid'].includes(ext)) {
        throw new Error(`Invalid file extension: ${ext}. Only .mmd and .mermaid files are supported.`)
      }

      // Determine output file path
      const baseName = resolvedFile.replace(/\.(mmd|mermaid)$/, '')
      let outputFile: string

      if (outputDir) {
        // If outputDir is specified, use it
        const fileName = baseName.split('/').pop() || 'diagram'
        await mkdir(outputDir, { recursive: true })
        outputFile = join(outputDir, `${fileName}.svg`)
      } else {
        // Same directory as input file
        outputFile = `${baseName}.svg`
      }

      // Ensure output directory exists
      await mkdir(dirname(outputFile), { recursive: true })

      // Generate SVG using mermaid-cli
      const command = `mmdc -i "${resolvedFile}" -o "${outputFile}" -t ${theme} -b ${backgroundColor}`
      
      consola.log(`📄 Processing: ${file}`)
      await execAsync(command)
      
      results.success.push(outputFile)
      consola.success(`Generated: ${outputFile}`)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.failed.push({ file, error: errorMessage })
      consola.error(`Failed to process ${file}: ${errorMessage}`)
    }
  }

  // Summary
  consola.box(`📊 Summary:\n✅ Success: ${results.success.length}\n❌ Failed: ${results.failed.length}`)
  
  if (results.failed.length > 0) {
    consola.error(`Failed files:`)
    results.failed.forEach(({ file, error }) => {
      consola.error(`  • ${file}: ${error}`)
    })
  }

  return results
}

/**
 * Main command definition using citty
 */
const main = defineCommand({
  meta: {
    name: 'generate-mermaid-svgs',
    description: '🧜‍♀️ Generate SVG files from Mermaid diagrams',
    version: '1.0.0'
  },
  args: {
    files: {
      type: 'positional',
      description: 'Mermaid files to convert (.mmd or .mermaid)',
      required: true
    },
    theme: {
      type: 'string',
      description: 'Mermaid theme to use',
      default: 'neutral'
    },
    backgroundColor: {
      type: 'string',
      description: 'Background color for the SVG',
      default: 'transparent'
    },
    outputDir: {
      type: 'string',
      description: 'Output directory for SVG files (defaults to same directory as input)'
    }
  },
  async run({ args }) {
    const files = Array.isArray(args.files) ? args.files : [args.files]
    
    if (files.length === 0) {
      consola.error('No files provided')
      process.exit(1)
    }

    // Run conversion
    const results = await generateMermaidSVGs(files, {
      theme: args.theme,
      backgroundColor: args.backgroundColor,
      outputDir: args.outputDir
    })
    
    // Exit with error code if any failures
    if (results.failed.length > 0) {
      process.exit(1)
    }
  }
})

// Run the command directly
runMain(main)

export { generateMermaidSVGs }
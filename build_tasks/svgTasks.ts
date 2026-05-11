import { Configuration } from "./_configuration";
import gulp from 'gulp'
import fs from 'fs';
import path from 'path';


export const svgCryptoIconsRegistryGenerator = (configuration: Configuration): gulp.TaskFunction => {
    return async function svgCryptoIconsRegistryGeneratorImpl(cb) {
        const { optimize } = await import('svgo');

        const files = [];
        const available = [];
        const missing = [];
        const opName = 'svgCryptoIconsRegistryGenerator';
        const baseDir = process.cwd();
        const icons: Record<string, string> = {};

        for (const id of configuration.cryptoIconsSvgs.lookup) {
            const filePath = path.resolve(baseDir, configuration.cryptoIconsSvgs.input, `${id.toLowerCase()}.svg`);
            if (fs.existsSync(filePath)) {
                files.push(filePath);
                available.push(id.toLowerCase());
                const svg = fs.readFileSync(filePath, 'utf-8');
                icons[id.toLowerCase()] = optimize(svg, { multipass: true }).data;
            } else {
                missing.push(id.toLowerCase());
            }
        }

        if (missing.length) {
            console.warn(`Missing (${missing.length}) icons :`, missing);
        }

        if (files.length === 0) {
            throw new Error(`No valid SVG files found for ${opName} task`);
        } else {
            console.info(`Found ${files.length} valid SVG files for ${opName} task.`);
        }




        const ts = `
// AUTO-GENERATED FILE — DO NOT EDIT

export const CRYPTO_ICON_REGISTRY : Record<string, string> = ${JSON.stringify(icons, null, 2)};

export function getCryptoIconId(input: string, fallback = 'generic') {
  const id = input.toLowerCase();
  return CRYPTO_ICON_REGISTRY[id.toLowerCase()] || CRYPTO_ICON_REGISTRY[fallback];
}
`;
        const registryFilePath = path.resolve(
            process.cwd(),
            configuration.cryptoIconsSvgs.outputRegistryTsFile
        );
        fs.mkdirSync(path.dirname(registryFilePath), { recursive: true });
        fs.writeFileSync(registryFilePath, ts);
        cb();
    }
};


export const svgActionIconsRegistryGenerator = (configuration: Configuration): gulp.TaskFunction => {
    return async function svgActionIconsRegistryGeneratorImpl(cb) {
        const { optimize } = await import('svgo');

        const files = [];
        const available = [];
        const missing = [];
        const opName = 'svgActionIconsRegistryGenerator';
        const baseDir = process.cwd();
        const icons: Record<string, string> = {};

        for (const id of configuration.actionsIconsSvgs.lookup) {
            const filePath = path.resolve(baseDir, configuration.actionsIconsSvgs.input, `${id.toLowerCase()}.svg`);
            if (fs.existsSync(filePath)) {
                files.push(filePath);
                available.push(id.toLowerCase());
                const svg = fs.readFileSync(filePath, 'utf-8');
                const svgOptimised = optimize(svg, { multipass: true, plugins:[
                    {
                    name: 'removeAttrs',
                    params: {
                        attrs: '(fill|stroke|style)'
                    }
                    }
                ]}).data;
                icons[id.toLowerCase()] = svgOptimised;
                //console.info(`Optimised icon ${id} -> ${svgOptimised}`)
            } else {
                missing.push(id.toLowerCase());
            }
        }

        if (missing.length) {
            console.warn(`Missing (${missing.length}) icons :`, missing);
        }

        if (files.length === 0) {
            throw new Error(`No valid SVG files found for ${opName} task`);
        } else {
            console.info(`Found ${files.length} valid SVG files for ${opName} task.`);
        }




        const ts = `
// AUTO-GENERATED FILE — DO NOT EDIT

export const ACTION_ICON_REGISTRY : Record<string, string> = ${JSON.stringify(icons, null, 2)};

const dp = new DOMParser();
const cache = new Map<string, SVGElement>();

export function getActionIconId(input: string, fallback = 'minus-circle'): SVGElement {
  const id = input.toLowerCase();
  const cached = cache.get(id);

  if (cached) {
    return cached.cloneNode(true) as SVGElement;
  }

  const rawSvg = ACTION_ICON_REGISTRY[id.toLowerCase()] || ACTION_ICON_REGISTRY[fallback];
  const parsed = dp.parseFromString(rawSvg, "image/svg+xml");
  const element = parsed.documentElement;
  if (!(element instanceof SVGElement)) {
    throw new Error("Invalid SVG: root is not SVGElement");
  }
  const svg = element as SVGElement;
  cache.set(id, svg);
  return svg.cloneNode(true) as SVGElement;

}
`;
        const registryFilePath = path.resolve(
            process.cwd(),
            configuration.actionsIconsSvgs.outputRegistryTsFile
        );
        fs.mkdirSync(path.dirname(registryFilePath), { recursive: true });
        fs.writeFileSync(registryFilePath, ts);
        cb();
    }
};
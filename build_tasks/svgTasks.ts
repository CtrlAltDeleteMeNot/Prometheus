import { Configuration } from "./_configuration";
import gulp from 'gulp'
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';


export const cryptoIconsRegistryGenerator = (configuration: Configuration): gulp.TaskFunction => {
    return async function cryptoIconsRegistryGeneratorImpl(cb) {        
        const opName = 'cryptoIconsRegistryGenerator';
        const baseDir = process.cwd();
        const icons: Record<string, string> = {};
        

        const inputDir = path.resolve(baseDir, configuration.symbolIcons.inputDir);
        const outputDir = path.resolve(baseDir, configuration.symbolIcons.outputDir);
        const pattern = '*.png';
        const filePaths = await glob(pattern, { cwd: inputDir, absolute: true });
        if (filePaths.length === 0) {
            throw new Error(`No valid image files found for ${opName} task`);
        } else {
            console.info(`Found ${filePaths.length} valid SVG files for ${opName} task.`);
        }
        fs.mkdirSync(outputDir);


        for (const imageFilePath of filePaths) {
            const fileName = path.basename(imageFilePath);
            const id = path.basename(fileName, '.png').toLowerCase();
            //const svgRaw = fs.readFileSync(svgFilePath, 'utf-8');
            //const svgOptimised = optimize(svgRaw, { multipass: true }).data;
            const outFilePath = path.join(outputDir, fileName);
            //fs.writeFileSync(outFilePath, svgOptimised, 'utf-8');
            fs.copyFileSync(imageFilePath, outFilePath);
            icons[id] = configuration.symbolIcons.relativeUrlPrefix + path.basename(outFilePath);
        }
        let fallbackDest = path.join(outputDir, "generic-fallback.png");
        fs.copyFileSync(configuration.symbolIcons.genericImagePath, fallbackDest);
        icons['generic-fallback'] = configuration.symbolIcons.relativeUrlPrefix + path.basename(fallbackDest);





        const ts = `
// AUTO-GENERATED FILE — DO NOT EDIT

export const SYMBOL_ICON_REGISTRY : Record<string, string> = ${JSON.stringify(icons, null, 2)};

export function getSymbolImageUrlById(input: string, fallback = 'generic-fallback') {
  const id = input.toLowerCase();
  return SYMBOL_ICON_REGISTRY[id.toLowerCase()] || SYMBOL_ICON_REGISTRY[fallback];
}
`;
        const registryFilePath = path.resolve(
            process.cwd(),
            configuration.symbolIcons.outputRegistryTsFile
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

        for (const id of configuration.actionIconsSvgs.lookup) {
            const filePath = path.resolve(baseDir, configuration.actionIconsSvgs.inputDir, `${id.toLowerCase()}.svg`);
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

export function getActionIconSVGElement(input: string, fallback = 'minus-circle'): SVGElement {
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
            configuration.actionIconsSvgs.outputRegistryTsFile
        );
        fs.mkdirSync(path.dirname(registryFilePath), { recursive: true });
        fs.writeFileSync(registryFilePath, ts);
        cb();
    }
};
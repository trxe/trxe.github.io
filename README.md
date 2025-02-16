# trxe.github.io

Written in Typescript and built with vite.js, 
but just contains just the `.ts` files and assets.

Made possible with three.js and 
Looks drab now, but look forward to:
- [ ] More SVG icons
- [x] Galleries for each experience
- [x] Shader code sandbox

## How to build

1. Install node.js and run `npm init`
2. Create a file `package.json` and copy in the following.

    ```
    {
        "name": "trxe-site",
        "private": true,
        "version": "0.0.0",
        "scripts": {
            "dev": "vite",
            "build": "tsc && vite build",
            "preview": "vite preview"
        },
        "devDependencies": {
            "@types/dat.gui": "^0.7.7",
            "typescript": "^4.5.4",
            "vite": "^2.9.9"
        },
        "dependencies": {
            "@types/three": "^0.140.0",
            "dat.gui": "^0.7.9",
            "gsap": "file:gsap-bonus.tgz",
            "three": "^0.140.2"
        }
    }
    ```
3. Run `npm install`.
4. Create a file `tsconfig.json` and copy in the following.
    ```
    {
        "compilerOptions": {
            "target": "ESNext",
            "useDefineForClassFields": true,
            "module": "ESNext",
            "lib": ["ESNext", "DOM"],
            "moduleResolution": "Node",
            "strict": true,
            "sourceMap": true,
            "resolveJsonModule": true,
            "isolatedModules": true,
            "esModuleInterop": true,
            "noEmit": true,
            "noUnusedLocals": true,
            "noUnusedParameters": true,
            "noImplicitReturns": true,
            "skipLibCheck": true
        },
        "include": ["src"]
    }
    ```
5. Create a file `vite.config.js` and copy in the following.
    ```
    module.exports = {
        root: 'src',
        build: {
            outDir: '../dist'
        }
    };
    ```
6. Create a subfolder `/src` and run `git clone https://github.com/trxe/personal-site.git`.
7. Run `npm run dev` for developmental build, or `npm run build` for production build.


## Scripts used

| **File**          | **Description**                                                     |
|-------------------|---------------------------------------------------------------------|
| main.ts           | Definitions of all scene components, callbacks and onclick handlers |
| animations.ts     | GSAP-based utility functions for scene/page animations              |
| lights.ts         | Definitions of scene lights                                         |
| objects.ts        | Definitions of scene meshes and shaders                             |
| scene_settings.ts | Configs for position and placement of items in the scene            |
| utils.ts          | Definitions for helper interfaces and general utility functions     |

Content is defined in `index.html` and styled in `style.css`.
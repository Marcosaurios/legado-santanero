# Recipes Static Site

This is a static project built for gathering all the recipes from a CMS and rendering them in a website, making them searchable and readable for everyone.
The project follows the Functional Requirements explained in each issue labeled as `basicRF`, so I can track its progress more precisely. You can take a look to them [here](https://github.com/Marcosaurios/recipes/issues?q=is%3Aopen+is%3Aissue+label%3AbasicRF)

Stakeholders: My dad

Developers: me

## Development

- `npm run dev` to run it locally
- `npm run cf-export-types` to sync the types used in the application with the types used in the CMS, if something has changed in the CMS-side.

## Things I've learnt

### Typescript and `d.ts` definitions

To have all the content I needed inside the webapp, I wanted to pass it through a _[global constant replacement](https://vitejs.dev/config/shared-options.html#define)_ (using `define` config in `vite.config.ts`), because it's a content that won't change along the webapp runtime. In short, this replacement happens at build/compilation time, meaning that until that stage happens, the _constant_ remains of type `unknown`, and intellisense won't guess the type.

To avoid that, you can make use of your own definition files. In this case, I created `whatever.d.ts` with the new matching types, such: `declare const __PIECE_TO_REPLACE__: number`. Later, wherever you use `__PIECE_TO_REPLACE__` it will be automatically typed (if your IDE/TS config detects the `*.d.ts`, that probably will). Otherwise you just need to import your definitions with `/// <reference type="path/To/env.d.ts" />`.

#### But what if...

... you need a more complex type? Imagine you need a `ComplexType` that is defined in your app types with more dependencies on it. Then you would think about different solutions, such:

- Option A)

  You'd think that importing the type in the `*.d.ts` file would be enough:

  ```ts
  import type { ComplexType } from './myTypes'
  declare const __PIECE_TO_REPLACE__: ComplexType[]
  ```

  And that was my first thought as well, but is not right. Before getting too deep, let's explain shortly what kind of Typescript files exists:
  - `module` &rarr; a `*.ts` file where you use `import` or `export` statements. The types defined here will be **private** unless exposed.
  - `scripts` &rarr; a `*.ts` file that simply defines an interface, and **it's included in the bundle**. The types defined here will be **public**.

  You see already where are we going right? The aforementioned solution wouldn't work, because the `*.d.ts` file will be detected as a `module`, making the contents private.

- Option B)

  Okey, we can't export that way, but then I stumbled upon declaring the global namespace worked, such as:

  ```ts
  import type { ComplexType } from './myTypes'
  declare global {
  	const __PIECE_TO_REPLACE__: ComplexType[]
  }
  ```

  By [overriding the global scope](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html) we _should_ have a good reason to do it (such as extending the logic of a native JS prototype). In my personal situation, we weren't, so let's not try to modify the global module if possible.

- Option C) _(and valid, IMO)_

  In `*.d.ts` files we can import other TS types with an `import()` instruction when required. For our use case, the following code will make it work:

  ```ts
  declare const __PIECE_TO_REPLACE__: import('./path/where/ComplexType/lives').ComplexType[]
  ```

  There's no need to place this previous definition in a `*.d.ts` file by the way, you could be defining them in the same TS file where you use all these statically replaced variables. But for organization it's worth to keep them separately.

  References: [TS Global module](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html), [Daniel Tabuenca on SO](https://stackoverflow.com/a/42257742/8703494) and [Michal Lytak on SO](https://stackoverflow.com/a/51114250/8703494)

- **Modules importing**: When running node JS scripts and using `ES Modules` `import`s, you must provide the file extension always in the importing path.

### CSS

#### Atomic Design Principles

Organizing your code structure is important to guarantee consistency across your changes. Not only for your own _inner peace of mind_ of keeping things _where you believe_, but also to give some solid meaning to your codebase. One of the most known techniques is the Atomic principle, where you organise your code following the next schema:

- Atoms: smallest unit of meaning. Your own definition of how an "input" element should look like.
- Molecules: components that need 2 atoms or more to work together. More complex structures fit here: a searchbox, having an input and a buton, for example. I broke a bit this rule, to also place components here that are complex and aren't built _only_ of atoms, but weren't small enough to fit into the atoms category.
- Organisms: can combine multiple molecules, and also atoms. It's easy to confuse between Molecule and Organism, but I just follow the simple rule: For a component to be an organism, needs to have a molecule and an atom.
- Templates: these are whole blocks of views that will fit into the webappm, composed of any of the previous categories. Will include mostly organisms, but not limited to these.

#### Some rules unkown to me

- `display: contents` &rarr; element's children to appear as if they were direct children of the element's parent, ignoring the element surrounding DOM. Useful to ignore the DOM structure and apply the stylings to its childrens and its recursive children. References: [SO](https://stackoverflow.com/a/78224467/8703494)

### Svelte kit

- **Prerendering**: I was confused understanding how the static content loads in the `load` function. I thought Sveltekit will crawl this `load` functions and store each value in the static generated site. Instead, in the `svelte.config.js` options we have a useful [prerendering](https://kit.svelte.dev/docs#configuration-prerender) option with an `entries` parameter: an array of URL pages. Sveltekit will look for each URLs in our code in the compilation time, resolving each one statically.

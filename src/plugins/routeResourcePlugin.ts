import type { Plugin } from 'vite'
import type { OutputChunk } from 'rollup'
function routeResourcePlugin(
  type: 'modulepreload' | 'prefetch',
): Plugin {
  const routeNames = [
    'Dashboard',
    'User',
    'Order',
    'Topic',
  ]

  let base = '/'

  return {
    name: `route-${type}`,
    apply: 'build',
    configResolved(config) {
      base = config.base
    },

    transformIndexHtml: {
      order: 'post',

      handler(_html, ctx) {
        if (!ctx.bundle) {
          return
        }

        const routeChunks = Object.values(ctx.bundle)
          .filter(
            (item): item is OutputChunk =>
              item.type === 'chunk',
          )
          .filter((chunk) => {
            return routeNames.some((routeName) =>
              Object.keys(chunk.modules).some((moduleId) =>
                moduleId.endsWith(
                  `/src/pages/${routeName}.tsx`,
                ),
              ),
            )
      })
      
        const tags = routeChunks.map((chunk) => ({
          tag: 'link',
          attrs: {
            rel: type,
            href: `${base}${chunk.fileName}`,
            ...(type === 'prefetch'
              ? {}
              : {
                  as: 'script',
                }),
          },
          injectTo: 'head-prepend' as const,
        }))

        return {
          html: _html,
          tags,
        }
      },
    },
  }
}


export { routeResourcePlugin }
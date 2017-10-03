import store from '../store'


const tstr = new Promise(resolve => {
    const unwatch = store.watch(
        s => [s.templateName, s.templateStr],
        ([tname, tstr]) => {
            if (tname === 'Custom') {
                resolve(tstr)
                unwatch()
            }
        },
        { immediate: true }
    )
})

export default async () => ({
    template: await tstr
})

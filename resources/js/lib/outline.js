/*
 * Ordem das aulas de um módulo ou curso livre.
 * Tokens: "video:<id>", "set:<id>", "material:<id>", "application", "support".
 */

/** Ordena itens ({ token }) conforme a lista de tokens; os ausentes vão para o fim, na ordem original. */
export function orderByOutline(items, outline = []) {
    const rank = new Map((outline ?? []).map((t, i) => [t, i]));
    return items
        .map((item, i) => ({ item, i, r: rank.has(item.token) ? rank.get(item.token) : Infinity }))
        .sort((a, b) => a.r - b.r || a.i - b.i)
        .map((x) => x.item);
}

/** Tokens do servidor (com ids) → tokens do formulário (com _key). collections: { video: [...], set: [...] } */
export function outlineToClient(outline, collections) {
    return (outline ?? [])
        .map((token) => {
            if (!token.includes(':')) return token;
            const [type, id] = token.split(':');
            const found = (collections[type] ?? []).find((x) => String(x.id) === id);
            return found ? `${type}:${found._key}` : null;
        })
        .filter(Boolean);
}

/** Tokens do formulário (com _key) → tokens por índice para o envio ("video:0"). */
export function outlineForSubmit(order, collections) {
    return order
        .map((token) => {
            if (!token.includes(':')) return token;
            const [type, key] = token.split(':');
            const index = (collections[type] ?? []).findIndex((x) => x._key === key);
            return index >= 0 ? `${type}:${index}` : null;
        })
        .filter(Boolean);
}

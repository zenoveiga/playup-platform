import axios from 'axios';
import { useRef, useState } from 'react';

/*
 * Envio direto de arquivos do navegador para o bucket S3 (URL pré-assinada).
 * Arquivos grandes não passam pelo PHP, evitando o erro "Content Too Large" (413).
 */

export class DirectUploadUnavailable extends Error {}

function firstError(error) {
    const errors = error?.response?.data?.errors;
    if (errors) return Object.values(errors).flat()[0];
    return error?.response?.data?.message || error?.message || 'Falha no envio do arquivo.';
}

function putWithProgress(url, file, contentType, headers, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url);
        // Precisa ser igual ao Content-Type usado na assinatura.
        xhr.setRequestHeader('Content-Type', contentType);
        Object.entries(headers ?? {}).forEach(([k, v]) => {
            if (k.toLowerCase() === 'content-type') return;
            // "Host" é definido pelo navegador e não pode ser enviado manualmente.
            if (k.toLowerCase() !== 'host') xhr.setRequestHeader(k, Array.isArray(v) ? v[0] : v);
        });
        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded, e.total);
        xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
                ? resolve()
                : reject(new Error(`O armazenamento recusou o arquivo "${file.name}" (HTTP ${xhr.status}).`));
        xhr.onerror = () =>
            reject(new Error(`Não foi possível enviar "${file.name}" ao armazenamento. Verifique a conexão e a configuração de CORS do bucket.`));
        xhr.send(file);
    });
}

/** Envia um arquivo e devolve a chave temporária para mandar junto com o formulário. */
export async function uploadDirect(file, kind, onProgress) {
    const contentType = file.type || 'application/octet-stream';
    let presign;
    try {
        presign = await axios.post(route('platform.uploads.store'), {
            kind,
            filename: file.name,
            content_type: contentType,
            size: file.size,
        });
    } catch (error) {
        if (error?.response?.status === 409) throw new DirectUploadUnavailable();
        throw new Error(firstError(error));
    }

    await putWithProgress(presign.data.url, file, contentType, presign.data.headers, onProgress);
    return presign.data.key;
}

/**
 * Envia em sequência todos os arquivos pendentes.
 * jobs: [{ id, file, kind }] — devolve { [id]: upload_key } ou null se o envio direto não estiver disponível.
 * cache: Map reutilizado entre tentativas para não reenviar o mesmo arquivo.
 */
export async function uploadAll(jobs, { cache, onProgress } = {}) {
    const result = {};
    const totalBytes = jobs.reduce((s, j) => s + j.file.size, 0) || 1;
    let doneBytes = 0;

    for (const [index, job] of jobs.entries()) {
        const cached = cache?.get(job.id);
        if (cached && cached.file === job.file) {
            result[job.id] = cached.key;
            doneBytes += job.file.size;
            continue;
        }

        try {
            const key = await uploadDirect(job.file, job.kind, (loaded) =>
                onProgress?.({
                    percentage: Math.round(((doneBytes + loaded) / totalBytes) * 100),
                    current: index + 1,
                    total: jobs.length,
                    name: job.file.name,
                }),
            );
            result[job.id] = key;
            cache?.set(job.id, { file: job.file, key });
            doneBytes += job.file.size;
        } catch (error) {
            if (error instanceof DirectUploadUnavailable) return null;
            throw error;
        }
    }

    return result;
}

/**
 * Hook para os formulários: envia os arquivos pendentes direto ao bucket antes de salvar.
 * run(jobs) → { [id]: upload_key } | null (sem envio direto: os arquivos seguem no formulário).
 */
export function useDirectUploads() {
    const cache = useRef(new Map());
    const [uploading, setUploading] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    const run = async (jobs) => {
        setUploadError(null);
        if (!jobs.length) return {};
        setUploading({ percentage: 0, current: 1, total: jobs.length, name: jobs[0].file.name });
        try {
            return await uploadAll(jobs, { cache: cache.current, onProgress: setUploading });
        } catch (error) {
            setUploadError(error.message);
            throw error;
        } finally {
            setUploading(null);
        }
    };

    return { run, uploading, uploadError };
}

/** Tipo de envio conforme o material. */
export const uploadKindFor = (type) => (type === 'video' ? 'video' : type === 'document' ? 'document' : 'file');

/** Troca o arquivo pela chave do envio direto, quando houver. */
export const withUploadKey = (keys) => (item) =>
    keys && keys[item._key] ? { ...item, file: null, upload_key: keys[item._key] } : item;

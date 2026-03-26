export type Tag = {
    prefix: string;
    tag: string;
}

export const joinPrefixes = (parentPrefix: string, prefix: string): string => [parentPrefix, prefix].join('/');

export const createTag = (parentPrefix: string, prefix: string, tag: string): Tag => ({ prefix: [parentPrefix, prefix].join('/'), tag });

export const msgTag = (tag: Tag): string => [tag.prefix, tag.tag].join(':');
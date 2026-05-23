import { Type, type Static } from '@sinclair/typebox';

export const TagSchema = Type.Object({
  tag: Type.String(),
});

export type Tag = Static<typeof TagSchema>;

export const UploadSchema = Type.Object({
  url: Type.Optional(Type.String()),
  alt: Type.Optional(Type.String()),
});

export type Upload = Static<typeof UploadSchema>;

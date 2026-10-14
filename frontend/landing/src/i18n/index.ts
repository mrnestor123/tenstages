// i18n: English lives at /, Spanish (Spain) at /es/. Pages are shared views; copy lives in en.ts / es.ts.
import en, { type Dict } from './en';
import es from './es';

export type Lang = 'en' | 'es';
export const dicts: Record<Lang, Dict> = { en, es };
export const htmlLang: Record<Lang, string> = { en: 'en', es: 'es-ES' };
export const ogLocale: Record<Lang, string> = { en: 'en_US', es: 'es_ES' };
export const other = (l: Lang): Lang => (l === 'en' ? 'es' : 'en');

const prefix = (l: Lang) => (l === 'en' ? '' : '/es');
const stageSlug: Record<Lang, string> = { en: 'stages', es: 'etapas' };
export const homePath = (l: Lang) => (l === 'en' ? '/' : '/es/');
export const stagePath = (l: Lang, n: number) => `${prefix(l)}/${stageSlug[l]}/${n}`;
const privacySlug: Record<Lang, string> = { en: 'privacy', es: 'privacidad' };
export const privacyPath = (l: Lang) => `${prefix(l)}/${privacySlug[l]}`;
const supportSlug: Record<Lang, string> = { en: 'support', es: 'soporte' };
export const supportPath = (l: Lang) => `${prefix(l)}/${supportSlug[l]}`;
export const anchor = (l: Lang, id: 'path' | 'app') => `${homePath(l)}#${id}`;

export type Group = 'novice' | 'skilled' | 'transition' | 'adept';
const groupByStage: Group[] = ['novice', 'novice', 'novice', 'skilled', 'skilled', 'skilled', 'transition', 'adept', 'adept', 'adept'];
export const groupOf = (n: number) => groupByStage[n - 1];

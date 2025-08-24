import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Evidence {
  'id' : bigint,
  'url' : string,
  'description' : string,
  'timestamp' : bigint,
  'uploader' : Principal,
}
export interface Message {
  'content' : string,
  'role' : Role,
  'sender' : Principal,
  'timestamp' : bigint,
}
export type Role = { 'Defendant' : null } |
  { 'Plaintiff' : null } |
  { 'AIJudge' : null } |
  { 'Judge' : null } |
  { 'AILawyer' : null } |
  { 'Observer' : null };
export interface Trial {
  'id' : bigint,
  'log' : Array<Message>,
  'status' : string,
  'judge' : Principal,
  'observers' : Array<Principal>,
  'verdict' : [] | [string],
  'defendant' : Principal,
  'evidence' : Array<Evidence>,
  'aiVerdict' : [] | [string],
  'plaintiff' : Principal,
}
export interface _SERVICE {
  'createTrial' : ActorMethod<[Principal, Principal], bigint>,
  'getTrial' : ActorMethod<[bigint], [] | [Trial]>,
  'joinTrial' : ActorMethod<[bigint], boolean>,
  'listTrials' : ActorMethod<[], Array<Trial>>,
  'postMessage' : ActorMethod<[bigint, Role, string], boolean>,
  'setAIVerdict' : ActorMethod<[bigint, string], boolean>,
  'setVerdict' : ActorMethod<[bigint, string], boolean>,
  'submitEvidence' : ActorMethod<[bigint, string, string], boolean>,
}

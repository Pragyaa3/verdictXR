import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Evidence {
  'id' : bigint,
  'url' : string,
  'description' : string,
  'timestamp' : bigint,
  'uploader' : Principal,
}
export interface Message {
  'content' : string,
  'role' : string,
  'sender' : Principal,
  'timestamp' : bigint,
}
export interface Participant {
  'principal' : Principal,
  'joinedAt' : bigint,
  'role' : string,
}
export interface Trial {
  'id' : bigint,
  'log' : Array<Message>,
  'status' : string,
  'participants' : Array<Participant>,
  'createdAt' : bigint,
  'judge' : [] | [Principal],
  'observers' : Array<Principal>,
  'verdict' : [] | [string],
  'caseDetails' : [] | [string],
  'defendant' : [] | [Principal],
  'evidence' : Array<Evidence>,
  'aiVerdict' : [] | [string],
  'plaintiff' : [] | [Principal],
  'caseTitle' : string,
}
export interface _SERVICE {
  'createTrial' : ActorMethod<[Principal, string], bigint>,
  'generateInviteCode' : ActorMethod<[bigint], [] | [string]>,
  'getTrial' : ActorMethod<[bigint], [] | [Trial]>,
  'getTrialFromCode' : ActorMethod<[string], [] | [Trial]>,
  'getTrialStats' : ActorMethod<
    [],
    { 'closedTrials' : bigint, 'openTrials' : bigint, 'totalEvidence' : bigint }
  >,
  'getTrialsByParticipant' : ActorMethod<[Principal], Array<Trial>>,
  'joinTrial' : ActorMethod<[bigint, Principal, string], boolean>,
  'joinTrialWithCode' : ActorMethod<[string, Principal, string], boolean>,
  'listTrials' : ActorMethod<[], Array<Trial>>,
  'postMessage' : ActorMethod<[bigint, string, string], boolean>,
  'setAIVerdict' : ActorMethod<[bigint, string], boolean>,
  'setCaseDetails' : ActorMethod<[bigint, string], boolean>,
  'setCaseTitle' : ActorMethod<[bigint, string], boolean>,
  'setVerdict' : ActorMethod<[bigint, string], boolean>,
  'submitEvidence' : ActorMethod<[bigint, string, string, Principal], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

export const idlFactory = ({ IDL }) => {
  const Role = IDL.Variant({
    'Defendant' : IDL.Null,
    'Plaintiff' : IDL.Null,
    'AIJudge' : IDL.Null,
    'Judge' : IDL.Null,
    'AILawyer' : IDL.Null,
    'Observer' : IDL.Null,
  });
  const Message = IDL.Record({
    'content' : IDL.Text,
    'role' : Role,
    'sender' : IDL.Principal,
    'timestamp' : IDL.Int,
  });
  const Evidence = IDL.Record({
    'id' : IDL.Nat,
    'url' : IDL.Text,
    'description' : IDL.Text,
    'timestamp' : IDL.Int,
    'uploader' : IDL.Principal,
  });
  const Trial = IDL.Record({
    'id' : IDL.Nat,
    'log' : IDL.Vec(Message),
    'status' : IDL.Text,
    'judge' : IDL.Principal,
    'observers' : IDL.Vec(IDL.Principal),
    'verdict' : IDL.Opt(IDL.Text),
    'defendant' : IDL.Principal,
    'evidence' : IDL.Vec(Evidence),
    'aiVerdict' : IDL.Opt(IDL.Text),
    'plaintiff' : IDL.Principal,
  });
  return IDL.Service({
    'createTrial' : IDL.Func([IDL.Principal, IDL.Principal], [IDL.Nat], []),
    'getTrial' : IDL.Func([IDL.Nat], [IDL.Opt(Trial)], ['query']),
    'joinTrial' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'listTrials' : IDL.Func([], [IDL.Vec(Trial)], ['query']),
    'postMessage' : IDL.Func([IDL.Nat, Role, IDL.Text], [IDL.Bool], []),
    'setAIVerdict' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    'setVerdict' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    'submitEvidence' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };

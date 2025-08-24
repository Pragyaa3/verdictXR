export const idlFactory = ({ IDL }) => {
  const Message = IDL.Record({
    'content' : IDL.Text,
    'role' : IDL.Text,
    'sender' : IDL.Principal,
    'timestamp' : IDL.Int,
  });
  const Participant = IDL.Record({
    'principal' : IDL.Principal,
    'joinedAt' : IDL.Int,
    'role' : IDL.Text,
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
    'participants' : IDL.Vec(Participant),
    'createdAt' : IDL.Int,
    'judge' : IDL.Opt(IDL.Principal),
    'observers' : IDL.Vec(IDL.Principal),
    'verdict' : IDL.Opt(IDL.Text),
    'caseDetails' : IDL.Opt(IDL.Text),
    'defendant' : IDL.Opt(IDL.Principal),
    'evidence' : IDL.Vec(Evidence),
    'aiVerdict' : IDL.Opt(IDL.Text),
    'plaintiff' : IDL.Opt(IDL.Principal),
    'caseTitle' : IDL.Text,
  });
  return IDL.Service({
    'createTrial' : IDL.Func([IDL.Principal, IDL.Text], [IDL.Nat], []),
    'generateInviteCode' : IDL.Func([IDL.Nat], [IDL.Opt(IDL.Text)], []),
    'getTrial' : IDL.Func([IDL.Nat], [IDL.Opt(Trial)], ['query']),
    'getTrialFromCode' : IDL.Func([IDL.Text], [IDL.Opt(Trial)], ['query']),
    'getTrialStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'closedTrials' : IDL.Nat,
            'openTrials' : IDL.Nat,
            'totalEvidence' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getTrialsByParticipant' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Trial)],
        ['query'],
      ),
    'joinTrial' : IDL.Func([IDL.Nat, IDL.Principal, IDL.Text], [IDL.Bool], []),
    'joinTrialWithCode' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'listTrials' : IDL.Func([], [IDL.Vec(Trial)], ['query']),
    'postMessage' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [IDL.Bool], []),
    'setAIVerdict' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    'setCaseDetails' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    'setCaseTitle' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    'setVerdict' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    'submitEvidence' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Principal],
        [IDL.Bool],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };

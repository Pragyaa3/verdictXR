import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";

persistent actor CourtBackend {
  func findIndex<T>(arr: [T], pred: (T) -> Bool) : ?Nat {
    var i = 0;
    for (x in arr.vals()) {
      if (pred(x)) { return ?i };
      i += 1;
    };
    return null;
  };
  public type Role = { #Judge; #Plaintiff; #Defendant; #Observer; #AIJudge; #AILawyer };
  public type Evidence = {
    id: Nat;
    uploader: Principal;
    url: Text;
    description: Text;
    timestamp: Int;
  };
  public type Message = {
    sender: Principal;
    role: Role;
    content: Text;
    timestamp: Int;
  };
  public type Trial = {
    id: Nat;
    judge: Principal;
    plaintiff: Principal;
    defendant: Principal;
    observers: [Principal];
    evidence: [Evidence];
    log: [Message];
    verdict: ?Text;
    aiVerdict: ?Text;
    status: Text; // "open", "closed", etc.
  };

  stable var trials : [Trial] = [];
  stable var nextId : Nat = 0;

 // ✅ NEW stable var for invite codes
  stable var trialInvites : [(Nat, Text)] = [];

  public shared ({caller}) func createTrial(plaintiff: Principal, defendant: Principal): async Nat {
    let trial = {
      id = nextId;
      judge = caller;
      plaintiff = plaintiff;
      defendant = defendant;
      observers = [];
      evidence = [];
      log = [];
      verdict = null;
      aiVerdict = null;
      status = "open";
    };
    trials := Array.append(trials, [trial]);
    nextId += 1;
    return trial.id;
  };

  public shared ({caller}) func joinTrial(trialId: Nat): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        if (Array.find<Principal>(t.observers, func (p) = p == caller) == null) {
          let updated = {
            id = t.id;
            judge = t.judge;
            plaintiff = t.plaintiff;
            defendant = t.defendant;
            observers = Array.append(t.observers, [caller]);
            evidence = t.evidence;
            log = t.log;
            verdict = t.verdict;
            aiVerdict = t.aiVerdict;
            status = t.status;
          };
          trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        };
        true
      }
    }
  };

public shared func generateInviteCode(trialId: Nat) : async ?Text {
  let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
  switch (idx) {
    case null { null };
    case (?i) {
      let code = "INV-" # Nat.toText(trialId) # "-" # Nat.toText(Int.abs(Time.now()));
      trialInvites := Array.append(trialInvites, [(trialId, code)]);
      ?code
    }
  }
};

 // ✅ NEW: Join with invite code
  public shared ({caller}) func joinTrialWithCode(inviteCode: Text) : async Bool {
    let entry = Array.find<(Nat, Text)>(trialInvites, func (p) { p.1 == inviteCode });
    switch (entry) {
      case null { false };
      case (?pair) {
        let trialId = pair.0;
        await joinTrial(trialId)
      }
    }
  };

  public shared ({caller}) func submitEvidence(trialId: Nat, url: Text, description: Text): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        let evidence = {
          id = t.evidence.size();
          uploader = caller;
          url = url;
          description = description;
          timestamp = Time.now();
        };
        let updated = {
          id = t.id;
          judge = t.judge;
          plaintiff = t.plaintiff;
          defendant = t.defendant;
          observers = t.observers;
          evidence = Array.append(t.evidence, [evidence]);
          log = t.log;
          verdict = t.verdict;
          aiVerdict = t.aiVerdict;
          status = t.status;
        };
        trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        true
      }
    }
  };

  public shared ({caller}) func postMessage(trialId: Nat, role: Role, content: Text): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        let msg = {
          sender = caller;
          role = role;
          content = content;
          timestamp = Time.now();
        };
        let updated = {
          id = t.id;
          judge = t.judge;
          plaintiff = t.plaintiff;
          defendant = t.defendant;
          observers = t.observers;
          evidence = t.evidence;
          log = Array.append(t.log, [msg]);
          verdict = t.verdict;
          aiVerdict = t.aiVerdict;
          status = t.status;
        };
        trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        true
      }
    }
  };

  public shared ({caller}) func setVerdict(trialId: Nat, verdict: Text): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        let updated = {
          id = t.id;
          judge = t.judge;
          plaintiff = t.plaintiff;
          defendant = t.defendant;
          observers = t.observers;
          evidence = t.evidence;
          log = t.log;
          verdict = ?verdict;
          aiVerdict = t.aiVerdict;
          status = "closed";
        };
        trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        true
      }
    }
  };

  public shared ({caller}) func setAIVerdict(trialId: Nat, aiVerdict: Text): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        let updated = {
          id = t.id;
          judge = t.judge;
          plaintiff = t.plaintiff;
          defendant = t.defendant;
          observers = t.observers;
          evidence = t.evidence;
          log = t.log;
          verdict = t.verdict;
          aiVerdict = ?aiVerdict;
          status = t.status;
        };
        trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        true
      }
    }
  };

  public query func getTrial(trialId: Nat): async ?Trial {
    Array.find<Trial>(trials, func (t) = t.id == trialId)
  };

    public query func getTrialFromCode(code : Text) : async ?Trial {
    // Find the (trialId, code) pair
    let entry = Array.find<(Nat, Text)>(trialInvites, func (p) { p.1 == code });
    switch (entry) {
      case null { null };
      case (?pair) {
        let trialId = pair.0;
        // Look up the trial in trials array
        Array.find<Trial>(trials, func (t) = t.id == trialId)
      }
    }
  };

  
  public query func listTrials(): async [Trial] {
    trials
  };
}
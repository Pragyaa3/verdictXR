import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";

actor CourtBackend {
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
    let idx = Array.findIndex<Trial>(trials, func (t) = t.id == trialId);
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
          trials[i] := updated;
        };
        true
      }
    }
  };

  public shared ({caller}) func submitEvidence(trialId: Nat, url: Text, description: Text): async Bool {
    let idx = Array.findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        let evidence = {
          id = Nat.fromNat(t.evidence.size());
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
        trials[i] := updated;
        true
      }
    }
  };

  public shared ({caller}) func postMessage(trialId: Nat, role: Role, content: Text): async Bool {
    let idx = Array.findIndex<Trial>(trials, func (t) = t.id == trialId);
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
        trials[i] := updated;
        true
      }
    }
  };

  public shared ({caller}) func setVerdict(trialId: Nat, verdict: Text): async Bool {
    let idx = Array.findIndex<Trial>(trials, func (t) = t.id == trialId);
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
        trials[i] := updated;
        true
      }
    }
  };

  public shared ({caller}) func setAIVerdict(trialId: Nat, aiVerdict: Text): async Bool {
    let idx = Array.findIndex<Trial>(trials, func (t) = t.id == trialId);
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
        trials[i] := updated;
        true
      }
    }
  };

  public query func getTrial(trialId: Nat): async ?Trial {
    Array.find<Trial>(trials, func (t) = t.id == trialId)
  };

  public query func listTrials(): async [Trial] {
    trials
  };
} 
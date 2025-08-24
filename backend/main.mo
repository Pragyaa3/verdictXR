import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";

actor CourtBackend {
  func findIndex<T>(arr: [T], pred: (T) -> Bool) : ?Nat {
    var i = 0;
    for (x in arr.vals()) {
      if (pred(x)) { return ?i };
      i += 1;
    };
    return null;
  };

  public type Role = { #Judge; #Plaintiff; #Defendant; #Observer; };

  public type Evidence = {
    id: Nat;
    uploader: Principal;
    url: Text;
    description: Text;
    timestamp: Int;
  };

  public type Message = {
    sender: Principal;
    role: Text;
    content: Text;
    timestamp: Int;
  };

  public type Participant = {
    principal: Principal;
    role: Text; // Store as Text for frontend compatibility
    joinedAt: Int;
  };

  public type Trial = {
    id: Nat;
    judge: ?Principal;
    plaintiff: ?Principal;
    defendant: ?Principal; // optional, can be null if single user
    caseTitle: Text;
    observers: [Principal];
    evidence: [Evidence];
    log: [Message];
    verdict: ?Text;
    aiVerdict: ?Text;
    status: Text;
    caseDetails: ?Text; // Store case description for AI lawyers
    participants: [Participant]; // Track all participants with roles
    createdAt: Int;
  };

  private stable var trials : [Trial] = [];
  private stable var nextId : Nat = 0;
  private stable var trialInvites : [(Nat, Text)] = [];

  // Enhanced createTrial - single-user friendly (others optional)
  public shared ({caller}) func createTrial(creator: Principal, role: Text): async Nat {
    let trial : Trial = {
      id = nextId;
      caseTitle = "";
      judge = if (role == "Judge") ?creator else null;
      plaintiff = if (role == "Plaintiff") ?creator else null;
      defendant = if (role == "Defendant") ?creator else null;
      observers = if (role == "Observer") [creator] else [];
      evidence = [];
      log = [];
      verdict = null;
      aiVerdict = null;
      status = "open";
      caseDetails = null; // Will be set later
      participants = [{
        principal = caller;
        role = role;
        joinedAt = Time.now();
      }];
      createdAt = Time.now();
    };
    trials := Array.append<Trial>(trials, [trial]);
    nextId += 1;
    return trial.id;
  };

  // Enhanced joinTrial - now takes role parameter
  public shared ({caller = _}) func joinTrial(trialId: Nat, participant: Principal, role: Text): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        
        // Check if participant already joined
        let alreadyJoined = Array.find<Participant>(t.participants, func (p) = p.principal == participant);
        if (alreadyJoined != null) { return true }; // Already joined
        
        // ✅ Role validation - prevent duplicate judges/plaintiffs/defendants
        switch (role) {
          case ("Judge") { if (t.judge != null) { return false } }; // Judge already exists
          case ("Plaintiff") { if (t.plaintiff != null) { return false } }; // Plaintiff already exists  
          case ("Defendant") { if (t.defendant != null) { return false } }; // Defendant already exists
          case (_) { /* Observers can be multiple */ };
        };

        // Add participant
        let newParticipant = {
          principal = participant;
          role = role;
          joinedAt = Time.now();
        };
        
        let updated : Trial = {
          id = t.id;
          caseTitle = t.caseTitle;
          judge = if (role == "Judge") ?participant else t.judge;
          plaintiff = if (role == "Plaintiff") ?participant else t.plaintiff;
          defendant = if (role == "Defendant") ?participant else t.defendant;
          observers = if (role == "Observer") Array.append(t.observers, [participant]) else t.observers;
          evidence = t.evidence;
          log = t.log;
          verdict = t.verdict;
          aiVerdict = t.aiVerdict;
          status = t.status;
          caseDetails = t.caseDetails;
          participants = Array.append(t.participants, [newParticipant]);
          createdAt = t.createdAt;
        };
        trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        true
      }
    }
  };


  // ✅ NEW: Set case title
  public shared ({caller = _}) func setCaseTitle(trialId: Nat, caseTitle: Text): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        let updated : Trial = {
          id = t.id;
          caseTitle = caseTitle; // ✅ Update case title
          judge = t.judge;
          plaintiff = t.plaintiff;
          defendant = t.defendant;
          observers = t.observers;
          evidence = t.evidence;
          log = t.log;
          verdict = t.verdict;
          aiVerdict = t.aiVerdict;
          status = t.status;
          caseDetails = t.caseDetails;
          participants = t.participants;
          createdAt = t.createdAt;
        };
        trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        true
      }
    }
  };

  // Set case details for AI lawyer analysis
  public shared ({caller = _}) func setCaseDetails(trialId: Nat, caseDetails: Text): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        let updated : Trial = {
          id = t.id;
          caseTitle = t.caseTitle;
          judge = t.judge;
          plaintiff = t.plaintiff;
          defendant = t.defendant;
          observers = t.observers;
          evidence = t.evidence;
          log = t.log;
          verdict = t.verdict;
          aiVerdict = t.aiVerdict;
          status = t.status;
          caseDetails = ?caseDetails;
          participants = t.participants;
          createdAt = t.createdAt;
        };
        trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        true
      }
    }
  };

  public shared func generateInviteCode(trialId: Nat) : async ?Text {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { null };
      case (?_) {
        let code = "INV-" # Nat.toText(trialId) # "-" # Nat.toText(Int.abs(Time.now()) % 1000000);
        trialInvites := Array.append(trialInvites, [(trialId, code)]);
        ?code
      }
    }
  };

  // Enhanced: Join with invite code and role
  public shared ({caller = _}) func joinTrialWithCode(inviteCode: Text, participant: Principal, role: Text) : async Bool {
    let entry = Array.find<(Nat, Text)>(trialInvites, func (p) { p.1 == inviteCode });
    switch (entry) {
      case null { false };
      case (?pair) {
        let trialId = pair.0;
        await joinTrial(trialId, participant, role)
      }
    }
  };

  // Enhanced: Submit evidence with uploader principal
  public shared ({caller = _}) func submitEvidence(trialId: Nat, url: Text, description: Text, uploader: Principal): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        let evidence = {
          id = t.evidence.size();
          uploader = uploader;
          url = url;
          description = description;
          timestamp = Time.now();
        };
        let updated : Trial = {
          id = t.id;
          caseTitle = t.caseTitle;
          judge = t.judge;
          plaintiff = t.plaintiff;
          defendant = t.defendant;
          observers = t.observers;
          evidence = Array.append(t.evidence, [evidence]);
          log = t.log;
          verdict = t.verdict;
          aiVerdict = t.aiVerdict;
          status = t.status;
          caseDetails = t.caseDetails;
          participants = t.participants;
          createdAt = t.createdAt;
        };
        trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        true
      }
    }
  };

  public shared ({caller}) func postMessage(trialId: Nat, role: Text, content: Text): async Bool {
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
        let updated : Trial = {
          id = t.id;
          caseTitle = t.caseTitle;
          judge = t.judge;
          plaintiff = t.plaintiff;
          defendant = t.defendant;
          observers = t.observers;
          evidence = t.evidence;
          log = Array.append(t.log, [msg]);
          verdict = t.verdict;
          aiVerdict = t.aiVerdict;
          status = t.status;
          caseDetails = t.caseDetails;
          participants = t.participants;
          createdAt = t.createdAt;
        };
        trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        true
      }
    }
  };

  public shared ({caller = _}) func setVerdict(trialId: Nat, verdict: Text): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        let updated : Trial = {
          id = t.id;
          caseTitle = t.caseTitle;
          judge = t.judge;
          plaintiff = t.plaintiff;
          defendant = t.defendant;
          observers = t.observers;
          evidence = t.evidence;
          log = t.log;
          verdict = ?verdict;
          aiVerdict = t.aiVerdict;
          status = "closed";
          caseDetails = t.caseDetails;
          participants = t.participants;
          createdAt = t.createdAt;
        };
        trials := Array.tabulate<Trial>(trials.size(), func (j) { if (j == i) updated else trials[j] });
        true
      }
    }
  };

  public shared ({caller = _}) func setAIVerdict(trialId: Nat, aiVerdict: Text): async Bool {
    let idx = findIndex<Trial>(trials, func (t) = t.id == trialId);
    switch (idx) {
      case null { false };
      case (?i) {
        let t = trials[i];
        let updated : Trial = {
          id = t.id;
          caseTitle = t.caseTitle;
          judge = t.judge;
          plaintiff = t.plaintiff;
          defendant = t.defendant;
          observers = t.observers;
          evidence = t.evidence;
          log = t.log;
          verdict = t.verdict;
          aiVerdict = ?aiVerdict;
          status = t.status;
          caseDetails = t.caseDetails;
          participants = t.participants;
          createdAt = t.createdAt;
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
        Array.find<Trial>(trials, func (t) = t.id == trialId)
      }
    }
  };

  // Get trials by participant
  public query func getTrialsByParticipant(participant: Principal): async [Trial] {
    Array.filter<Trial>(trials, func (t) = 
      Array.find<Participant>(t.participants, func (p) = p.principal == participant) != null
    )
  };

  public query func listTrials(): async [Trial] {
    trials
  };

  // Get trial statistics
  public query func getTrialStats(): async {openTrials: Nat; closedTrials: Nat; totalEvidence: Nat} {
    let openTrials = Array.filter<Trial>(trials, func (t) = t.status == "open");
    let closedTrials = Array.filter<Trial>(trials, func (t) = t.status == "closed");
    let totalEvidence = Array.foldLeft<Trial, Nat>(trials, 0, func (acc, t) = acc + t.evidence.size());
    {
      openTrials = openTrials.size();
      closedTrials = closedTrials.size(); 
      totalEvidence = totalEvidence;
    }
  };
}
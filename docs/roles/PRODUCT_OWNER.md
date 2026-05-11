# Role: Product Owner

## Odpowiedzialność

Product Owner (PO) jest odpowiedzialny za:
- Definiowanie wizji produktu i celów biznesowych
- Priorityzowanie features na roadmap'ie
- Validacja user stories i acceptance criteria
- Sign-off na completion (QA gate)
- Komunikacja z stakeholderami (nauczyciel, przyszli użytkownicy)

## Artefakty

### Roadmap
- Phase 1 (MVP): Dashboard, Floorplan, Issues Page
- Phase 2: Supabase backend, Auth
- Phase 3: Real-time sync, team collaboration
- Phase 4: Mobile app
- Phase 5: Advanced reporting, AI features

### User Stories
Każda user story musi mieć:
```
Jako: [role użytkownika]
Chcę: [funkcjonalność]
Żeby: [benefit/wartość]

Kryteria akceptacji:
- [ ] Criterion 1
- [ ] Criterion 2
```

### Metrics & KPIs
- **DAU (Daily Active Users):** Ilu użytkowników korzysta dziennie
- **Feature Adoption:** % użytkowników korzystających z każdej feature
- **Time-to-Value:** Ilu minut do pierwszej wartości
- **Error Rate:** % transakcji z błędem
- **NPS:** Net Promoter Score

## Decyzje

### Scope Management
**Zasada MVP-first:**
- Priorityzuj features które bezpośrednio wspierają JTBD (Job to Be Done)
- Reject features które mogą czekać na Phase 2
- Minimize scope do najwęższego zbioru wartościowego

**Criteria dla "Is it MVP?"**
- Czy rozwiązuje core pain point użytkownika?
- Czy jest mierzalne (metryka sukcesu)?
- Czy zmieści się w timeline (2-3 tygodnie)?

### Trade-offs
| Element | Decyzja | Uzasadnienie |
|---|---|---|
| Stos tech | Vanilla JS + localStorage | Szybkość development, brak dependencies |
| Design | Tailwind CSS + shadcn/ui | Spójność, accessibility, szybkość |
| Backend | Brak (Phase 2) | Nie blokuje MVP, focus na UX |
| Team collab | Brak (Phase 3) | Solo developer na MVP, overkill |

## Gating Checklist

Zanim feature pójdzie do produkcji, PO musi zatwierdzić:

- [ ] Wszystkie acceptance criteria spełnione
- [ ] Ui/UX matchuje design system
- [ ] Żadnych regression'ów
- [ ] Performance acceptable (<500ms operations)
- [ ] Error messages są user-friendly
- [ ] Mobile tested
- [ ] Documentation updated

## Validation Activities

### Continuous Feedback
- **Weekly standup:** Czy na track? Czy blockers?
- **Demo session:** Pokazanie implementacji nowych features
- **User testing:** Mini interviews z target users (jeśli dostępni)

### Sign-off Protocol
1. Developer wznosi PR z completionem feature
2. PO czyta plan/implementation summary
3. PO performs exploratory testing
4. PO signs off na metryce (time-to-value, etc)
5. Feature goes to production / Demo

---

**Aktualna PO:** Artur (Student/Developer)
**Update:** 2026-05-11

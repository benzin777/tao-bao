# Reference Map

## Purpose

This document prevents reinvention. Each product stage should map to an existing proven pattern, then be adapted to the English Construction Workbench.

## Source References

| Stage | Reference | What To Borrow | What Not To Copy |
| --- | --- | --- | --- |
| Lesson loop | Cambridge Write & Improve | Write, receive feedback, revise, resubmit. Treat the tool as a pedagogical practice environment, not a passive editor. | Do not make long essay scoring the MVP. This app starts with sentence construction. |
| Feedback restraint | Cambridge Write & Improve | Avoid overwhelming the learner. Prioritize the target lesson and only reveal secondary feedback after the main issue is handled. | Do not mark every possible improvement at once. |
| Issue visualization | Grammarly | Inline/near-text suggestions, categories, result sidebar, goals that tailor feedback. | Do not imitate proprietary UI or use a generic Grammarly clone as the product identity. |
| Scoring categories | Grammarly Writing Score API | Category thinking: correctness, clarity, engagement, delivery. | Do not make global writing score the main educational truth. Formula fit comes first. |
| Goals | Grammarly Goals | Audience, formality, domain, intent influence suggestions. | Do not expose too many writing goals in MVP. Use one small `Variant` control first. |
| Issue object schema | LanguageTool | Offset/length, message, replacement, rule/category, issue type. | Do not depend on LanguageTool for structure/formula evaluation. It checks language errors, not lesson fit. |
| Inline implementation | TextChecker | Suggestion object with original/replacement/explanation/type/start/end; underlines; popovers; issue panel; apply/ignore; stats. | Do not copy browser-extension assumptions. This is an in-app workbench first. |
| Minimal correction strictness | Open Grammarly | Conservative correction prompt, mode, aggressiveness/support, chunking, validation of indices. | Do not let AI rewrite correct sentences just to sound smarter. |
| Prompt commands | Scramble | Reusable text actions such as fix, improve, simplify, expand. | Transform these into lesson variants, not free-floating writing utilities. |
| Academic structure | CEFR Companion Volume | Coherence/cohesion grows from basic connectors to controlled use of cohesive devices and organisational patterns. | Do not reduce CEFR to a badge system in MVP. |
| Pedagogy | Graduated corrective feedback / ICALL research | Move from general hint to explicit correction only as needed; make the learner self-correct. | Do not immediately replace the learner's sentence with a perfect answer. |

## Product Rule

The result page must answer in this order:

1. Did the attempt satisfy the selected formula?
2. Did grammar or punctuation block correctness?
3. Did the logic read naturally?
4. Could the sentence be more fluent or creative while preserving the learner's baseline?
5. What should the learner rewrite now?

## Primary External URLs

- Write & Improve help: https://help.writeandimprove.com/en/articles/1104369-how-does-write-improve-work
- Write & Improve main surface: https://writeandimprove.com/
- Grammarly categories: https://www.grammarly.com/blog/product/better-writing-with-grammarly/
- Grammarly Writing Score API: https://developer.grammarly.com/writing-score-api.html
- Grammarly Goals: https://support.grammarly.com/hc/en-us/articles/360054679292-What-are-Goals
- Grammarly Performance: https://support.grammarly.com/hc/en-us/articles/360007144751-What-is-Performance-and-how-is-it-calculated
- LanguageTool repo: https://github.com/languagetool-org/languagetool
- LanguageTool output shape reference: https://learn.microsoft.com/en-us/connectors/languagetoolip/
- TextChecker repo: https://github.com/codextde/textchecker
- Open Grammarly repo: https://github.com/Aaryan6/open-grammarly
- Scramble repo: https://github.com/zlwaterfield/scramble
- CEFR level descriptions: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions
- CEFR Companion Volume: https://www.educarex.es/pub/cont/com/0059/documentos/CEFR-Companion_Volume_with_new_descriptors_-_2018.docx.pdf


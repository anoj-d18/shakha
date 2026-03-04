

## Findings

**Background image**: All three pages (Login, Register, Attendance) use `PageLayout` which renders the Bhagwa Dhwaj background consistently. No issues there.

**Language issue**: The English translations in `src/lib/lang.tsx` contain mixed languages:
- `loginTitle` in English mode is `"शाखा उपस्थिति प्रणाली"` (Hindi/Sanskrit, not English)
- `rssTitle` in English mode is `"राष्ट्रीय स्वयंसेवक संघ"` (Hindi)
- Field labels like `"Shakha (शाखा)"`, `"Taruna (तरुण)"` etc. mix English with Hindi in parentheses

The user wants: **English mode = all English**, **Kannada mode = all Kannada**.

## Plan

**Edit `src/lib/lang.tsx`** — Update the English (`en`) translations to be fully in English:

| Key | Current (English mode) | New (English mode) |
|-----|----------------------|-------------------|
| `loginTitle` | शाखा उपस्थिति प्रणाली | Shakha Attendance System |
| `rssTitle` | राष्ट्रीय स्वयंसेवक संघ | Rashtriya Swayamsevak Sangh |
| `rssSubtitle` | Rashtriya Swayamsevak Sangh | Shakha Attendance System |
| `shakha` | Shakha (शाखा) | Shakha |
| `date` | Date (दिनांक) | Date |
| `place` | Place (स्थान) | Place |
| `taruna` | Taruna (तरुण) | Taruna |
| `balaka` | Balaka (बालक) | Balaka |
| `total` | Total (कुल) | Total |
| `shishu` | Shishu (शिशु) | Shishu |
| `abhyagata` | Abhyagata (अभ्यागत) | Abhyagata |
| `anya` | Anya (अन्य) | Anya |
| `pravasa` | Pravasa (प्रवास) | Pravasa |
| `vishesha` | Vishesha (विशेष) | Vishesha |
| `shikshanaLabel` | Shikshana (ಶಿಕ್ಷಣ) | Shikshana |

This is a single-file edit to `src/lib/lang.tsx`, updating approximately 15 translation values in the `en` object to remove all non-English text.


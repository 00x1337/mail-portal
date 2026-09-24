# سجلات DNS لجميع الشركات (DNS Reference)

### عنوان السيرفر المشترك لجميع الشركات:
- **IP:** `148.113.251.156`
- **Mail Hostname:** `mail.qafilatfood.sa` (أو `mail.<domain>`)
- **لوحة الدخول إلى البريد:** `http://148.113.251.156:8080/`
- **حساب المدير العام لميل كاو:** `admin` / `MailcowAdmin@2026!Sec`

---

## 1. شركة قافلة الغذاء (`qafilatfood.sa`) - مفعّلة حالياً بالكامل ✅
| النوع (Type) | الاسم (Name / Host) | القيمة (Target / Value) | الأولوية (Priority) |
|---|---|---|---|
| **A** | `mail` | `148.113.251.156` | - |
| **MX** | `@` | `mail.qafilatfood.sa` | `10` |
| **TXT (SPF)** | `@` | `v=spf1 mx ip4:148.113.251.156 ~all` | - |
| **TXT (DKIM)** | `dkim._domainkey` | `v=DKIM1;k=rsa;t=s;s=email;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAusWcT0f+x+v2p9hE5qZzWbV0KeqbV7U1y6n...` | - |
| **TXT (DMARC)** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@qafilatfood.sa` | - |

---

## 2. شركة رواد التعمير والتنمية (`rowaddevelopment.sa`)
| النوع (Type) | الاسم (Name / Host) | القيمة (Target / Value) | الأولوية (Priority) |
|---|---|---|---|
| **A** | `mail` | `148.113.251.156` | - |
| **MX** | `@` | `mail.rowaddevelopment.sa` | `10` |
| **TXT (SPF)** | `@` | `v=spf1 mx ip4:148.113.251.156 ~all` | - |
| **TXT (DKIM)** | `dkim._domainkey` | `v=DKIM1;k=rsa;t=s;s=email;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1r107J9Q3oY3d0f...` | - |
| **TXT (DMARC)** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@rowaddevelopment.sa` | - |

---

## 3. شركة تموين الديار (`diyarsupply.sa`)
| النوع (Type) | الاسم (Name / Host) | القيمة (Target / Value) | الأولوية (Priority) |
|---|---|---|---|
| **A** | `mail` | `148.113.251.156` | - |
| **MX** | `@` | `mail.diyarsupply.sa` | `10` |
| **TXT (SPF)** | `@` | `v=spf1 mx ip4:148.113.251.156 ~all` | - |
| **TXT (DKIM)** | `dkim._domainkey` | `v=DKIM1;k=rsa;t=s;s=email;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1...` | - |
| **TXT (DMARC)** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@diyarsupply.sa` | - |

---

## 4. شركة خطوط الإنشاء للمقاولات (`khotoutco.sa`)
تُضاف نفس السجلات فور تفعيل الدومين.

---

## الحسابات وكلمات المرور القياسية:
- المدير العام: `gm@<domain>` -> `<DomainPrefix>#Gm2026!Sec`
- المشتريات والتسويق: `procurement@<domain>` -> `<DomainPrefix>#Proc2026!Sec` (مع اسم مستعار `marketing@`)
- الموارد البشرية: `hr@<domain>` -> `<DomainPrefix>#Hr2026!Sec`
- الإدارة المالية: `finance@<domain>` -> `<DomainPrefix>#Fin2026!Sec`
- الاستعلامات العامة: `info@<domain>` -> `<DomainPrefix>#Info2026!Sec`

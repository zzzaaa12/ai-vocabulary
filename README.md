# ai-vocabulary-review

ä¸€?‹ä»¥ Flask ?“é€ ç??±æ??®å?ç­†è??¬è??¨æ?è¤‡ç?å·¥å…·ï¼Œå…§å»?AI ?¢ç??®å?è³‡è?ï¼ˆOpenAI/Geminiï¼‰ï??¯æ´ä¸»é??‡æ??ç¯©?¸ã€æ?å°‹è??²åº¦çµ±è???

## ?¹è‰²?Ÿèƒ½
- ä¸»é?ç³»çµ±ï¼šæ?/??ç¶??°ä¸»é¡Œå³?‚å??›ï??´ç??²å½©çµ±ä?
- AI å¿«é€ŸæŸ¥è©¢ï?è¼¸å…¥?®å??³è‡ª?•ç??ä¸­?‡ã€è‹±?‡å?ç¾©ã€éŸ³æ¨™ã€ä??¥ã€å??ç¾©è©?
- ?®å?ç®¡ç?ï¼šæ–°å¢ã€ç·¨è¼¯ã€åˆª?¤ã€æ?å°‹ã€æ??“ç¯©?¸ã€å?è¡¨ç€è¦½
- ?¨æ?è¤‡ç?ï¼šå¡?‡å?è¤‡ç?ä»‹é¢ï¼Œæ”¯?´ç¿»è½‰ã€ä?ä¸€??ä¸‹ä??‹ã€éµ?¤å¿«?·éµ
- çµ±è?è³‡è?ï¼šè?ä¸‰å¤©/ä¸€??ä¸€?‹æ?ç­‰æ•¸?šè??²åº¦æ¢é¡¯ç¤?

## Demo ?ªå?ï¼ˆå¯?¸ï?
- é¦–é?ï¼šAI å¿«é€ŸæŸ¥è©¢ã€å–®å­—å?è¡¨ã€æ??“ç¯©??
- ?¨æ?è¤‡ç?ï¼šå¡?‡ç¿»è½‰è??§åˆ¶?‰é?ï¼ˆç½®?¼é??¢å…§å®¹ç?å°¾ï?footer ä¸Šæ–¹ï¼?

## å®‰è??€æ±?
- Python 3.8+
- pip

## å¿«é€Ÿé?å§?
```bash
# 1) å»ºç??›æ“¬?°å?ä¸¦å?è£å?ä»?
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

# 2) ï¼ˆå¯?¸ï?è¨­å? AI APIï¼ˆOpenAI / Google Geminiï¼?
python config/setup_api.py

# 3) ï¼ˆå¯?¸ï??Ÿæ? SSL ?‘è?ä»¥å???HTTPS
python scripts/generate_ssl_cert.py

# 4) ?Ÿå??‹ç™¼ä¼ºæ???
$env:FLASK_APP='app.py'
.\.venv\Scripts\python.exe app.py
# HTTP æ¨¡å?: http://0.0.0.0:8080
# HTTPS æ¨¡å?: https://0.0.0.0:8080 (å¦‚æ? SSL ?‘è?)
```

## ä½¿ç”¨èªªæ?
- é¦–é? `AI å¿«é€ŸæŸ¥è©¢`ï¼?
  - è¼¸å…¥?±æ??®å? ???‰ã€ŒAI ?¥è©¢?â? é¡¯ç¤ºçµæ???Modalï¼Œå¯?´æ¥?²å??ºå–®å­?
- ?®å??—è¡¨ï¼?
  - ?³ä?è§’æ?ä¾›æ??“ç¯©?¸æ?ç±¤è??œå???
  - é»é¸?®å??¯æŸ¥?‹è©³ç´°è??™é???
- ?¨æ?è¤‡ç?ï¼?
  - å°è¦½?—é??Šã€Œéš¨æ©Ÿè?ç¿’ã€?
  - ä»¥å¡?‡æ–¹å¼ç€è¦½ï¼›ç©º?½éµ/Enter ç¿»é¢?å·¦?³æ–¹?‘éµ?‡æ?ä¸Šä???ä¸‹ä???

## è¨­å? AI APIï¼ˆå¯?¸ï?
ä½¿ç”¨äº’å?å¼è¨­å®šå·¥?·ï?
```bash
python config/setup_api.py
```
- è¨­å? OpenAI/Gemini API Keyï¼ˆå??¨å?å¯†å„²å­˜æ–¼ `config/api_keys.json`ï¼?
- ?¸æ?ä½¿ç”¨æ¨¡å??é?è¨­æ?ä¾›å??è??‚æ??“è??è©¦æ¬¡æ•¸

ç¨‹å??–å‘¼?«ï?
```python
from config.api_config import api_config
api_config.set_openai_api_key('sk-...')
api_config.set_gemini_api_key('AIzaSy...')
api_config.set_default_provider('openai')
```

## å°ˆæ?çµæ?
```
mydict_webapp_0820_cursor/
?œâ? app.py                      # Flask ä¸»è??¥å£?‡è·¯??
?œâ? config/
?? ?œâ? api_config.py           # AI è¨­å?ç®¡ç??‡å?å¯?
?? ?”â? setup_api.py            # äº’å?å¼è¨­å®šå·¥??
?œâ? models/                    # è³‡æ?æ¨¡å?ï¼ˆWord ç­‰ï?
?œâ? services/                  # æ¥­å??è¼¯ï¼ˆå–®å­—ã€AI ?å?ï¼?
?œâ? templates/                 # Jinja2 æ¨¡æ¿ï¼ˆå«ä¸»é??–ç? UIï¼?
?œâ? static/
?? ?”â? css/themes.css          # ä¸»é?ç³»çµ±?‡é??²è???
?œâ? requirements.txt
?”â? LICENSE
```

## æ¸¬è©¦
```bash
python -m pytest -q
```

## HTTPS ?¯æ´
?¬å?æ¡ˆå…§å»?HTTPS ?¯æ´ï¼Œæ?ä¾›å??¨ç?? å??????

### SSL ?‘è?è¨­å?
1. **?ªå??Ÿæ??ªç°½?æ?è­‰ï??‹ç™¼/æ¸¬è©¦ï¼?*ï¼?
   ```bash
   python scripts/generate_ssl_cert.py
   ```

2. **ä½¿ç”¨?¾æ??‘è?**ï¼?
   - å°‡æ?è­‰æ?æ¡ˆæ”¾??`certs/cert.pem`
   - å°‡ç??°æ?æ¡ˆæ”¾??`certs/key.pem`

3. **ä¼ºæ??¨è¨­å®?*ï¼?
   - è¨ªå? `/settings/server` ?²è? HTTPS ?ç½®
   - ?¯æ´?ªè?ä¸»æ?ä½å??é€?¥? ã€æ?è­‰è·¯å¾?
   - ?¯å??¨å¼·??HTTPS ?æ–°å°å?

### å®‰å…¨?Ÿèƒ½
- SSL/TLS ? å????
- å¼·åˆ¶ HTTPS ?æ–°å°å?
- ?¯æ´??½ 0.0.0.0ï¼ˆæ??‰ç¶²è·¯ä??¢ï?
- ?‘è?æª”æ??ªå?æª¢æ¸¬?‡é?è­?

## ?¨ç½²ï¼ˆç°¡?“ï?
- ä½¿ç”¨?å?ä»??ï¼ˆNginxï¼‰è??Ÿç”¢ WSGIï¼ˆgunicorn/waitress ç­‰ï??Ÿå?
- è¨­å??°å?è®Šæ•¸ `SECRET_KEY`ï¼Œç¢ºä¿?`config/` ä¸‹ç??‘é‘°?‡è¨­å®šæ??·å?å¯«å…¥æ¬Šé?
- ?Ÿç”¢?°å?å»ºè­°ä½¿ç”¨?—ä¿¡ä»»ç? CA ?‘è?ï¼ˆå? Let's Encryptï¼?

## ?ˆæ? License
MIT Licenseï¼Œè©³è¦?`LICENSE`??

## è²¢ç»
æ­¡è? issue / PR?‚æ?äº¤å?è«‹ï?
- ?µå??¢æ?ç¨‹å?é¢¨æ ¼
- ç¢ºä??®å?æ¸¬è©¦?šé?



## Vercel + Supabase ³¡¸p¡]JavaScript ª©¥»¡A¤£¦A¨Ï¥Î Python¡^

¦¹±M®×¤w·s¼W Next.js + Supabase ªº«e«áºİ¡]µL¦øªA¾¹¡^ª©¥»¡A¤è«K¤@Áä³¡¸p¨ì Vercel¡A¸ê®ÆÀx¦s»Pµn¤J¥æ¥Ñ Supabase¡C

### ¬[ºc·§Äı
- «eºİ®Ø¬[¡GNext.js¡]Vercel ­ì¥Í¤ä´©¡^
- »{ÃÒ/¸ê®Æ®w¡GSupabase¡]email magic link µn¤J + Postgres + RLS¡^
- ¥D­n¥\¯à¡G
  - ³æ¦r²M³æ/·j´M¡]­º­¶¡^
  - ·s¼W/½s¿è/§R°£³æ¦r
  - ½Æ²ß¤¶­±¡]§å¦¸¡BÁôÂÃ/Åã¥Ü¡B§xÃø¼Ğ°O¡^

### ±M®×¦ì¸m
- Next.js µ{¦¡½X©ñ¦b®Ú¥Ø¿ı¡]`package.json`¡B`app/` µ¥¡^¡C
- Supabase schema SQL¡G`supabase.sql`
- «eºİ³]©wÀÉ¡G`next.config.mjs`¡B`.env.example`

### ³¡¸p¨BÆJ
1) «Ø¥ß Supabase ±M®×¡A¨ú±o¥H¤UÀô¹ÒÅÜ¼Æ¡G
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2) ¦b Supabase SQL ½s¿è¾¹°õ¦æ¸ê®Æªí/µ¦²¤
- ¥´¶} Supabase ±M®× ¡÷ SQL ¡÷ New query
- ¶K¤W `supabase.sql` ¤º®e¨Ã°õ¦æ¡A«Ø¥ß `words` ªí»P RLS ¬Fµ¦

3) ¥»¾÷¶}µo¡]¥i¿ï¡^
```bash
# Node 18+
cp .env.example .env.local
# ¶ñ¤J¹ïÀ³ªº Supabase ÅÜ¼Æ
npm install
npm run dev
# ÂsÄı http://localhost:3000
```

4) ³¡¸p¨ì Vercel
- ·s¼W±M®× ¡÷ Import ¥» repo
- ¦b Vercel ±M®×ªº Settings ¡÷ Environment Variables¡G
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`¡]¨Ò¦p https://§Aªº°ì¦W ¡^
- Deploy¡]Vercel ·|¦Û°Ê°»´ú Next.js¡^

### ¨Ï¥Î¤è¦¡¡]·sª©¡^
- ­º­¶¡GÅã¥Ü³æ¦r²M³æ¡A¥i·j´M¡FÂI¡u·s¼W³æ¦r¡v«Ø¥ß¸ê®Æ¡C
- ½Æ²ß­¶ `/review`¡G
  - ¥H 20 µ§¬°¤@§å¦¸¡A¤ä´©¥ş³¡ÁôÂÃ/Åã¥Ü¡B­µ¼Ğ/¤¤¤åÄæ¦ì¤Á´«¡C
  - ¥i±N³æ¦r¼Ğ°O¬°¡u§xÃø¡v¡]·|¦^¼g¨ì¸ê®Æªíªº `is_difficult`¡^¡C
- µn¤J­¶ `/login`¡G¿é¤J email ¦¬¨úµn¤J³sµ²¡]magic link¡^¡C

### ª`·N¨Æ¶µ
- ³o­Ó Next.js ª©¥»»PÂÂ Flask ª©¦P®w¨Ã¦s¡AVercel ¥u·|¨Ì `package.json` «Ø¸m Next.js¡A¤£¦A¨Ï¥Î Python¡C
- ­Y­n¾É¤J AI ¬d¸ß¡]OpenAI/Gemini¡^¡A«ØÄ³·s¼W Next.js Route Handler §@¬°¦øªA¾¹ºİ¥N²z¨Ã¥HÀô¹ÒÅÜ¼Æ¦s©ñ API Key¡]¥Ø«e¥¼¤º«Ø¡^¡C



### ¶i¶¥¡GAI §Ö³t¬d¸ß¡]¥i¿ï¡^
- ·s¼W¤F POST /api/ai¡A¤ä´© provider: openai ©Î gemini`n- »İ¦b Vercel/¥»¾÷Àô¹ÒÅÜ¼Æ³]©w¡GOPENAI_API_KEY ©Î GOOGLE_API_KEY`n- ·s¼W³æ¦r­¶ªº¡uAI §Ö³t¬d¸ß¡v«ö¶s·|©I¥s¦¹ API ¨Ã¦Û°Ê¶ñ¤JÄæ¦ì

### ¶×¤JÂÂ¸ê®Æ¡]¥i¿ï¡^
- ­Y¥»¾÷ data/vocabulary.json ¦³ÂÂ¸ê®Æ¡A¥i¥ÎªA°Èª÷Æ_§å¦¸¶×¤J¡G
`ash
# »İ¥ı¦Ü Supabase «Ø¥ß¨Ï¥ÎªÌ¡]¥i¥Î Magic Link µn¤J¤@¦¸²£¥Í¡^«á¨ú±o user_id
set SUPABASE_URL=... 
set SUPABASE_SERVICE_ROLE_KEY=...
set IMPORT_TARGET_USER_ID=<your_supabase_user_id>
npm run import:json
``n- ª`·N¡GRLS ·|¤¹³\ Service Role ¼g¤J¥ô·N user_id¡F¶È¨Ñ¶×¤J§@·~¨Ï¥Î¡A¤Å¦b«eºİÃn¥ú¦¹ª÷Æ_¡C

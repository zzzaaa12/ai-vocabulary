# ai-vocabulary-review

一?�以 Flask ?�造�??��??��?筆�??��??��?複�?工具，內�?AI ?��??��?資�?（OpenAI/Gemini）�??�援主�??��??�篩?�、�?尋�??�度統�???

## ?�色?�能
- 主�?系統：�?/??�??�主題即?��??��??��??�彩統�?
- AI 快速查詢�?輸入?��??�自?��??�中?�、英?��?義、音標、�??�、�??�義�?
- ?��?管�?：新增、編輯、刪?�、�?尋、�??�篩?�、�?表瀏覽
- ?��?複�?：卡?��?複�?介面，支?�翻轉、�?一??下�??�、鍵?�快?�鍵
- 統�?資�?：�?三天/一??一?��?等數?��??�度條顯�?

## Demo ?��?（可?��?
- 首�?：AI 快速查詢、單字�?表、�??�篩??
- ?��?複�?：卡?�翻轉�??�制?��?（置?��??�內容�?尾�?footer 上方�?

## 安�??��?
- Python 3.8+
- pip

## 快速�?�?
```bash
# 1) 建�??�擬?��?並�?裝�?�?
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

# 2) （可?��?設�? AI API（OpenAI / Google Gemini�?
python config/setup_api.py

# 3) （可?��??��? SSL ?��?以�???HTTPS
python scripts/generate_ssl_cert.py

# 4) ?��??�發伺�???
$env:FLASK_APP='app.py'
.\.venv\Scripts\python.exe app.py
# HTTP 模�?: http://0.0.0.0:8080
# HTTPS 模�?: https://0.0.0.0:8080 (如�? SSL ?��?)
```

## 使用說�?
- 首�? `AI 快速查詢`�?
  - 輸入?��??��? ???�「AI ?�詢?��? 顯示結�???Modal，可?�接?��??�單�?
- ?��??�表�?
  - ?��?角�?供�??�篩?��?籤�??��???
  - 點選?��??�查?�詳細�??��???
- ?��?複�?�?
  - 導覽?��??�「隨機�?習�?
  - 以卡?�方式瀏覽；空?�鍵/Enter 翻面?�左?�方?�鍵?��?上�???下�???

## 設�? AI API（可?��?
使用互�?式設定工?��?
```bash
python config/setup_api.py
```
- 設�? OpenAI/Gemini API Key（�??��?密儲存於 `config/api_keys.json`�?
- ?��?使用模�??��?設�?供�??��??��??��??�試次數

程�??�呼?��?
```python
from config.api_config import api_config
api_config.set_openai_api_key('sk-...')
api_config.set_gemini_api_key('AIzaSy...')
api_config.set_default_provider('openai')
```

## 專�?結�?
```
mydict_webapp_0820_cursor/
?��? app.py                      # Flask 主�??�口?�路??
?��? config/
?? ?��? api_config.py           # AI 設�?管�??��?�?
?? ?��? setup_api.py            # 互�?式設定工??
?��? models/                    # 資�?模�?（Word 等�?
?��? services/                  # 業�??�輯（單字、AI ?��?�?
?��? templates/                 # Jinja2 模板（含主�??��? UI�?
?��? static/
?? ?��? css/themes.css          # 主�?系統?��??��???
?��? requirements.txt
?��? LICENSE
```

## 測試
```bash
python -m pytest -q
```

## HTTPS ?�援
?��?案內�?HTTPS ?�援，�?供�??��??��??????

### SSL ?��?設�?
1. **?��??��??�簽?��?證�??�發/測試�?*�?
   ```bash
   python scripts/generate_ssl_cert.py
   ```

2. **使用?��??��?**�?
   - 將�?證�?案放??`certs/cert.pem`
   - 將�??��?案放??`certs/key.pem`

3. **伺�??�設�?*�?
   - 訪�? `/settings/server` ?��? HTTPS ?�置
   - ?�援?��?主�?位�??��?��?�、�?證路�?
   - ?��??�強??HTTPS ?�新導�?

### 安全?�能
- SSL/TLS ?��????
- 強制 HTTPS ?�新導�?
- ?�援??�� 0.0.0.0（�??�網路�??��?
- ?��?檔�??��?檢測?��?�?

## ?�署（簡?��?
- 使用?��?�??（Nginx）�??�產 WSGI（gunicorn/waitress 等�??��?
- 設�??��?變數 `SECRET_KEY`，確�?`config/` 下�??�鑰?�設定�??��?寫入權�?
- ?�產?��?建議使用?�信任�? CA ?��?（�? Let's Encrypt�?

## ?��? License
MIT License，詳�?`LICENSE`??

## 貢獻
歡�? issue / PR?��?交�?請�?
- ?��??��?程�?風格
- 確�??��?測試?��?



## Vercel + Supabase ���p�]JavaScript �����A���A�ϥ� Python�^

���M�פw�s�W Next.js + Supabase ���e��ݡ]�L���A���^�����A��K�@�䳡�p�� Vercel�A����x�s�P�n�J��� Supabase�C

### �[�c����
- �e�ݮج[�GNext.js�]Vercel ��ͤ䴩�^
- �{��/��Ʈw�GSupabase�]email magic link �n�J + Postgres + RLS�^
- �D�n�\��G
  - ��r�M��/�j�M�]�����^
  - �s�W/�s��/�R����r
  - �Ʋߤ����]�妸�B����/��ܡB�x���аO�^

### �M�צ�m
- Next.js �{���X��b�ڥؿ��]`package.json`�B`app/` ���^�C
- Supabase schema SQL�G`supabase.sql`
- �e�ݳ]�w�ɡG`next.config.mjs`�B`.env.example`

### ���p�B�J
1) �إ� Supabase �M�סA���o�H�U�����ܼơG
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2) �b Supabase SQL �s�边�����ƪ�/����
- ���} Supabase �M�� �� SQL �� New query
- �K�W `supabase.sql` ���e�ð���A�إ� `words` ��P RLS �F��

3) �����}�o�]�i��^
```bash
# Node 18+
cp .env.example .env.local
# ��J������ Supabase �ܼ�
npm install
npm run dev
# �s�� http://localhost:3000
```

4) ���p�� Vercel
- �s�W�M�� �� Import �� repo
- �b Vercel �M�ת� Settings �� Environment Variables�G
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`�]�Ҧp https://�A����W �^
- Deploy�]Vercel �|�۰ʰ��� Next.js�^

### �ϥΤ覡�]�s���^
- �����G��ܳ�r�M��A�i�j�M�F�I�u�s�W��r�v�إ߸�ơC
- �Ʋ߭� `/review`�G
  - �H 20 �����@�妸�A�䴩��������/��ܡB����/�����������C
  - �i�N��r�аO���u�x���v�]�|�^�g���ƪ� `is_difficult`�^�C
- �n�J�� `/login`�G��J email �����n�J�s���]magic link�^�C

### �`�N�ƶ�
- �o�� Next.js �����P�� Flask ���P�w�æs�AVercel �u�|�� `package.json` �ظm Next.js�A���A�ϥ� Python�C
- �Y�n�ɤJ AI �d�ߡ]OpenAI/Gemini�^�A��ĳ�s�W Next.js Route Handler �@�����A���ݥN�z�åH�����ܼƦs�� API Key�]�ثe�����ء^�C



### �i���GAI �ֳt�d�ߡ]�i��^
- �s�W�F POST /api/ai�A�䴩 provider: openai �� gemini`n- �ݦb Vercel/���������ܼƳ]�w�GOPENAI_API_KEY �� GOOGLE_API_KEY`n- �s�W��r�����uAI �ֳt�d�ߡv���s�|�I�s�� API �æ۰ʶ�J���

### �פJ�¸�ơ]�i��^
- �Y���� data/vocabulary.json ���¸�ơA�i�ΪA�Ȫ��_�妸�פJ�G
`ash
# �ݥ��� Supabase �إߨϥΪ̡]�i�� Magic Link �n�J�@�����͡^����o user_id
set SUPABASE_URL=... 
set SUPABASE_SERVICE_ROLE_KEY=...
set IMPORT_TARGET_USER_ID=<your_supabase_user_id>
npm run import:json
``n- �`�N�GRLS �|���\ Service Role �g�J���N user_id�F�ȨѶפJ�@�~�ϥΡA�Ŧb�e���n�������_�C

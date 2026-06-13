import os
import re

gtm_head = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W68CVLFG');</script>
<!-- End Google Tag Manager -->"""

gtm_body = """<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W68CVLFG"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->"""

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'GTM-W68CVLFG' in content:
        print(f"GTM já presente em {filepath}")
        return

    # Inserir no <head>
    if '<head>' in content:
        content = content.replace('<head>', f'<head>\n{gtm_head}')
    elif '<HEAD>' in content:
        content = content.replace('<HEAD>', f'<HEAD>\n{gtm_head}')
        
    # Inserir no <body>
    if '<body>' in content:
        content = content.replace('<body>', f'<body>\n{gtm_body}')
    elif '<BODY>' in content:
        content = content.replace('<BODY>', f'<BODY>\n{gtm_body}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Atualizado: {filepath}")

for root, dirs, files in os.walk('.'):
    if '.git' in dirs:
        dirs.remove('.git')
    for file in files:
        if file == 'index.html':
            update_file(os.path.join(root, file))

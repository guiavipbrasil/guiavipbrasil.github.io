import os

ga4_tag = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZSRH7057HB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-ZSRH7057HB');
</script>"""

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'G-ZSRH7057HB' in content:
        print(f"GA4 já presente em {filepath}")
        return

    # Inserir após o fechamento da tag do GTM ou no início do head
    if '<!-- End Google Tag Manager -->' in content:
        content = content.replace('<!-- End Google Tag Manager -->', f'<!-- End Google Tag Manager -->\n{ga4_tag}')
    elif '<head>' in content:
        content = content.replace('<head>', f'<head>\n{ga4_tag}')
    elif '<HEAD>' in content:
        content = content.replace('<HEAD>', f'<HEAD>\n{ga4_tag}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Atualizado: {filepath}")

for root, dirs, files in os.walk('.'):
    if '.git' in dirs:
        dirs.remove('.git')
    for file in files:
        if file == 'index.html':
            update_file(os.path.join(root, file))

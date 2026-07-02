import html.parser
class TagChecker(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.void = {'img','br','hr','input','link','meta','source','area','base','col','embed','param','track','wbr','path','circle','line','polygon','rect','polyline','ellipse'}
    def handle_starttag(self, tag, attrs):
        if tag not in self.void:
            self.stack.append((tag, self.getpos()))
    def handle_endtag(self, tag):
        if tag in self.void: return
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()
        else:
            print(f"Mismatch: expected {self.stack[-1][0]} got {tag} at line {self.getpos()[0]}")
            
tc = TagChecker()
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    tc.feed(f.read())
for tag, pos in tc.stack:
    print(f"Unclosed tag: {tag} opened at line {pos[0]}")

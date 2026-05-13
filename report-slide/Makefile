PDF=main.pdf
TEX=main.tex
TOOLS=$(wildcard tools/*.py)
DATA=$(wildcard [0-9][0-9]-*/papers.yml) $(wildcard [0-9][0-9]-*/story.yml)
SECTIONS=$(wildcard */section.tex)
SOURCES=$(TEX) config/preamble.tex $(TOOLS) $(DATA) $(SECTIONS)

all: $(PDF)

$(PDF): $(SOURCES)
	python tools/validate_content.py
	python tools/generate_beamer.py
	xelatex -interaction=nonstopmode $(TEX)
	xelatex -interaction=nonstopmode $(TEX)

check: $(PDF)
	@python tools/validate_content.py
	@if grep -E "LaTeX Warning: Reference .* undefined|There were undefined references|No file .*\\.tex|File .* not found|Fatal error|fontspec Error" main.log; then exit 1; fi
	@pdfinfo $(PDF) >/dev/null

pptx:
	python tools/validate_content.py
	node pptx/build.mjs

clean:
	rm -f *.aux *.log *.nav *.out *.snm *.toc *.vrb *.fls *.fdb_latexmk *.synctex.gz

cleanall: clean
	rm -f $(PDF)

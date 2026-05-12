PDF=main.pdf
TEX=main.tex
SOURCES=$(TEX) config/preamble.tex $(wildcard */section.tex)

all: $(PDF)

$(PDF): $(SOURCES)
	xelatex -interaction=nonstopmode $(TEX)
	xelatex -interaction=nonstopmode $(TEX)

check: $(PDF)
	@if grep -E "LaTeX Warning: Reference .* undefined|There were undefined references|No file .*\\.tex|File .* not found|Fatal error|fontspec Error" main.log; then exit 1; fi
	@pdfinfo $(PDF) >/dev/null

clean:
	rm -f *.aux *.log *.nav *.out *.snm *.toc *.vrb *.fls *.fdb_latexmk *.synctex.gz

cleanall: clean
	rm -f $(PDF)

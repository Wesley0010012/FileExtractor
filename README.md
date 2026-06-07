# File Extractor

CLI em TypeScript para compactar, extrair e inspecionar arquivos compactados.

```bash
npm install
npm run build
chmod +x archiver.sh
```

Use o wrapper:

```bash
./archiver.sh <comando> <tipo> <entrada> <saida?>
```

Os paths de `<entrada>` e `<saida>` continuam sendo interpretados a partir do diretorio onde o comando foi executado, a menos que voce use paths absolutos.

## Comandos

```bash
./archiver.sh compress <tipo> <entrada> <saida?>
./archiver.sh extract <tipo> <entrada> <saida?>
./archiver.sh inspect <tipo> <entrada>
./archiver.sh see <tipo> <entrada>
```

- `compress`: compacta arquivo ou diretorio.
- `extract`: extrai sempre para um diretorio.
- `inspect` ou `see`: lista o conteudo do arquivo compactado.

## Tipos

| Tipo | Extensao comum | Entrada para compressao | Observacoes |
| --- | --- | --- | --- |
| `zip` | `.zip` | arquivo ou diretorio | Diretorios sao percorridos recursivamente. |
| `tar` | `.tar` | diretorio | Preserva paths relativos. |
| `gz` | `.gz` | arquivo | GZIP compacta um unico arquivo, nao uma arvore de diretorios. |
| `7z` | `.7z` | arquivo ou diretorio | Requer o binario `7z` no sistema. |
| `rar` | `.rar` | arquivo ou diretorio | Requer os binarios `rar` e `unrar` no sistema. |

## Exemplos

Compactar:

```bash
./archiver.sh compress zip ./test ./test.zip
./archiver.sh compress tar ./test ./test.tar
./archiver.sh compress gz ./test/test.txt ./test.txt.gz
./archiver.sh compress 7z ./test ./test.7z
./archiver.sh compress rar ./test ./test.rar
```

Inspecionar:

```bash
./archiver.sh inspect zip ./test.zip
./archiver.sh inspect tar ./test.tar
./archiver.sh inspect gz ./test.txt.gz
./archiver.sh inspect 7z ./test.7z
./archiver.sh inspect rar ./test.rar
```

Extrair:

```bash
./archiver.sh extract zip ./test.zip ./out
./archiver.sh extract tar ./test.tar ./out
./archiver.sh extract gz ./test.txt.gz ./out
./archiver.sh extract 7z ./test.7z ./out
./archiver.sh extract rar ./test.rar ./out
```

## Saida padrao

Em `compress`, se `<saida>` nao for informado, o arquivo sera criado no diretorio em que o comando foi executado usando o nome da entrada e o tipo escolhido:

```bash
./archiver.sh compress zip ./test
# gera ./test.zip
```

Em `extract`, se `<saida>` nao for informado, a saida sera o diretorio em que o comando foi executado:

```bash
./archiver.sh extract zip ./test.zip
# extrai no diretorio atual
```

A extracao sempre cria um diretorio de destino. Se o path de saida ja existir, seja arquivo ou diretorio, sera criado outro diretorio com UUID no nome:

```bash
./archiver.sh extract zip ./test.zip ./out
# se ./out ja existir, extrai em ./out-93d8bca9-e526-483d-a5c1-8071a4b6d91f
```

## Dependencias externas

ZIP, TAR e GZIP usam bibliotecas Node instaladas pelo projeto.

7Z precisa do binario `7z`:

```bash
which 7z
```

RAR precisa dos binarios `rar` e `unrar`:

```bash
which rar
which unrar
```

## Erros

Erros do CLI seguem este formato:

```text
CLI Error [CODIGO]: mensagem
```

Exemplos:

```text
CLI Error [INVALID_ARCHIVER_TYPE]: Invalid archiver type: nope
CLI Error [INPUT_NOT_FOUND]: Input path does not exist: missing.zip
CLI Error [OUTPUT_MUST_BE_FILE]: Output path must be a file: output-dir
```

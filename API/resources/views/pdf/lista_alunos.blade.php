<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Lista de Presença - {{ $event->tema }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; line-height: 1.6; color: #333; }
        h1, h2 { text-align: center; }
        h1 { font-size: 24px; }
        h2 { font-size: 18px; font-weight: normal; margin-top: -10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .footer { text-align: center; font-size: 12px; color: #777; position: fixed; bottom: 0; width: 100%; }
    </style>
</head>
<body>

    <h1>Lista de Participantes Sorteados</h1>
    <h2>Evento: {{ $event->tema }}</h2>
    <h2>Data: {{$event->horario_inicio}} - {{$event->horario_termino}}</h2>
    <h2>Local: {{$event->local}}</h2>
    <h2>Palestrante: {{$event->palestrante}}</h2>

    <table>
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th>Nome do Aluno</th>
                <th style="width: 35%;">Assinatura</th>
            </tr>
        </thead>
        <tbody>
            @forelse($alunos as $aluno)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $aluno->name }}</td>
                    <td></td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" style="text-align: center;">Nenhum aluno selecionado.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Gerado em: {{ $dataGeracao }}
    </div>

</body>
</html>
<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;

class UserStatusService
{
    // Atualiza o status dos usuários selecionados ou cancelados
    public function updateUserStatus(Event $evento, $inscritos, $selecionadosNesteEvento)
    {
        // Atualiza o status de "selecionado" para os usuários que foram sorteados
        foreach ($selecionadosNesteEvento as $selecionado) {
            $evento->users()->updateExistingPivot($selecionado->id, ['status' => 'selecionado']);
        }

        // Encontra os usuários que não foram selecionados e atualiza seu status para "cancelado"
        $naoSelecionados = $inscritos->diff($selecionadosNesteEvento);
        foreach ($naoSelecionados as $naoSelecionado) {
            $evento->users()->updateExistingPivot($naoSelecionado->id, ['status' => 'cancelado']);
        }
    }
}

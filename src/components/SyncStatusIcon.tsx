import React from 'react';
import { Check, CheckCheck } from 'lucide-react-native';

interface Props {
  pending: boolean;
}

export function SyncStatusIcon({ pending }: Props) {
  return pending
    ? <Check size={14} color="#aaaaaa" />
    : <CheckCheck size={14} color="#4BA3C3" />;
}

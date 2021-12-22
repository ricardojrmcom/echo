import React, { useCallback, useMemo } from 'react';
import { useLocalState } from '@ricardo-jrm/use-local-state';
import {
  EchoContext,
  EchoContextType,
  EchoMsgs,
  EchoRecord,
} from '../../hooks/useEcho';

/**
 * EchoProvider interface
 */
export interface EchoProviderProps {
  /**
   * children
   */
  children: JSX.Element;
  /**
   * custom local storage ID prefix
   */
  lsid?: string;
  /**
   * Provided echos
   */
  echos: EchoRecord;
  /**
   * Default echo ID
   */
  echosDefault: string;
}

/**
 * EchoProvider
 */
export const EchoProvider = ({
  children,
  lsid,
  echos,
  echosDefault,
}: EchoProviderProps) => {
  // init active echo
  const [echoActiveId, echoActiveIdSet] = useLocalState(
    lsid || 'echo',
    echosDefault,
  );
  const echoActive = useMemo<EchoMsgs>(
    () => echos[echoActiveId],
    [echos, echoActiveId],
  );

  // set echo by id
  const echoSetById = useCallback<EchoContextType['echoSetById']>(
    (echoId) => {
      if (echos[echoId]) {
        echoActiveIdSet(echoId);
      } else {
        // eslint-disable-next-line no-console
        console.log('echo not found for given id: ', echoId);
      }
    },
    [echos, echoActiveIdSet],
  );

  // Echo spell
  const echo = useCallback<EchoContextType['echo']>(
    (key: string) => echoActive[key],
    [echoActive],
  );

  // build ctx
  const ctxEcho = useMemo<EchoContextType>(
    () => ({
      echo,
      echoActive,
      echoActiveId,
      echoSetById,
    }),
    [echo, echoActive, echoActiveId, echoSetById],
  );

  return (
    <EchoContext.Provider value={ctxEcho}>{children}</EchoContext.Provider>
  );
};
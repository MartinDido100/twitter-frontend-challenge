import { ChangeEvent, useContext, useEffect, useState } from 'react';
import SearchResultModal from './search-result-modal/SearchResultModal';
import { Author } from '../../service';
import { useSearchUsers } from '../../service/HttpRequestService';
import { useTranslation } from 'react-i18next';
import { StyledSearchBarContainer } from './SearchBarContainer';
import { StyledSearchBarInput } from './SearchBarInput';
import { useOutsideClick } from '../../hooks/useClickOutside';
import { ToastContext } from '../toast/FallbackToast';
import { ToastType } from '../toast/Toast';

export const SearchBar = () => {
  const [results, setResults] = useState<Author[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const limit = 4;
  const skip = 0;
  const { search } = useSearchUsers(query, limit, skip);
  let debounceTimer: NodeJS.Timeout;
  const { t } = useTranslation();
  const ToastCtx = useContext(ToastContext);

  const closeModal = () => {
    setQuery('');
    setSearched(false);
    setResults([]);
  };

  const ref = useOutsideClick(closeModal);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputQuery = e.target.value;
    setQuery(inputQuery);
  };

  useEffect(() => {
    clearTimeout(debounceTimer);

    if (!query) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceTimer = setTimeout(async () => {
      const { data: results, error } = await search();
      if (error) {
        setError(error);
      } else {
        setResults(results);
        setSearched(true);
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <>
      {ToastCtx && error && <ToastCtx.Toast type={ToastType.ALERT} message="Error searching users"></ToastCtx.Toast>}
      <StyledSearchBarContainer ref={ref}>
        <StyledSearchBarInput
          id="searchbar"
          onChange={handleChange}
          value={query}
          placeholder={t('placeholder.search')}
          autoComplete="off"
        />
        <SearchResultModal show={query.length > 0 && searched} results={results} />
      </StyledSearchBarContainer>
    </>
  );
};

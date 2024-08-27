import { ChangeEvent, useEffect, useState } from 'react';
import SearchResultModal from './search-result-modal/SearchResultModal';
import { Author } from '../../service';
import { useSearchUsers } from '../../service/HttpRequestService';
import { useTranslation } from 'react-i18next';
import { StyledSearchBarContainer } from './SearchBarContainer';
import { StyledSearchBarInput } from './SearchBarInput';
import { useOutsideClick } from '../../hooks/useClickOutside';

export const SearchBar = () => {
  const [results, setResults] = useState<Author[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const limit = 4;
  const skip = 0;
  const { search } = useSearchUsers(query, limit, skip);
  let debounceTimer: NodeJS.Timeout;
  const { t } = useTranslation();

  const closeModal = () => {
    setQuery('')
    setSearched(false)
    setResults([])
  }

  const ref = useOutsideClick(closeModal)

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
      try {
        const { data: results } = await search();
        setResults(results);
        setSearched(true);
      } catch (error) {
        console.log(error);
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
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
  );
};

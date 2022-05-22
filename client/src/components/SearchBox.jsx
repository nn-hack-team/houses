import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { DATA_LOADING_ERROR } from '../consts'


function SearchBox({ setListings, setLoading, setLastFetchedListing, fetchMore, setFetchMore }) {
	const geolocationEnabled = true
	const [pagination, setPagination] = useState(0)
	const [queryString, setQueryString] = useState('')
	const [searchData, setSearchData] = useState({
		address: '',
		type: null,
		low_price: '',
		high_price: ''
	})

	const {
		address,
		type,
		low_price,
		high_price
	} = searchData

	const onMutate = (e) => {
		let boolean = null
	
		if (e.target.value === 'true') {
		  boolean = true
		}
		if (e.target.value === 'false') {
		  boolean = false
		}
		
    	if (!e.target.files) {
			setSearchData((prevState) => ({
			...prevState,
			[e.target.id]: boolean ?? e.target.value,
			}))
		}
	}

	const onSubmit = async (e) => {
		e.preventDefault()
	
		setLoading(true)
	
		let geolocation = {}
		let location

		let searchString = ''
		
		if (address && address.length > 0 && geolocationEnabled) {
			const data = await fetch(
			`https://nominatim.openstreetmap.org/search.php?q=${address}&format=jsonv2`
			).then(res => res.json())
	
			console.log(data)
	
			geolocation.lat_start = data[0]?.boundingbox[0] ?? 0
			geolocation.lat_end = data[0]?.boundingbox[1] ?? 0
			geolocation.lng_start = data[0]?.boundingbox[2] ?? 0
			geolocation.lng_end = data[0]?.boundingbox[3] ?? 0
	
			location =
			data === []
				? undefined
				: data[0]?.display_name
	
			if (location === undefined || location.includes('undefined')) {
				setLoading(false)
				toast.error('Пожалуйста введите корректный адресс')
				return
			}

			searchString = `${searchString}&lat_start=${geolocation.lat_start}&lat_end=${geolocation.lat_end}&lng_start=${geolocation.lng_start}&lng_end=${geolocation.lng_end}`
		}

		if (type) {
			searchString = `${searchString}&category=${type}`
		}

		if (low_price) {
			searchString = `${searchString}&start_price=${low_price}`
		}

		if (high_price) {
			searchString = `${searchString}&end_price=${high_price}`
		}
		setPagination(0)
		setLoading(false)
		setQueryString(searchString)
	  }

	useEffect(() => {

		const fetchListings = async () => {
			try {
				const data = await fetch(`/api/houses/pagination/${pagination}/${pagination+10}?a=a${queryString}`)
					.then(response => response.json())

				const lastVisible = data[data.length - 1]
				setLastFetchedListing(lastVisible)

				setListings(data)
				setPagination(pagination + 10)
				setLoading(false)
			} catch (error) {
				toast.error(DATA_LOADING_ERROR)
			}
		}

		fetchListings()
	}, [queryString])

	useEffect(() => {
		const fetchMoreListings = async () => {
			try {
				const data = await fetch(`/api/houses/pagination/${pagination}/${pagination+10}?a=a${queryString}`)
				.then(response => response.json())
	
				const lastVisible = data[data.length - 1]
				setLastFetchedListing(lastVisible)
	
				setListings((prevState) => [...prevState, ...data])
				setPagination(pagination + 10)
				setLoading(false)
			} catch (error) {
				toast.error(DATA_LOADING_ERROR)
			}
		}

		if (fetchMore) {
			fetchMoreListings()
			setFetchMore(false)
		}

	}, [fetchMore])

  return (
    <form onSubmit={setListings}>
      <div className="searchBox">
        <div className="searchBlock addressBlock">
          <label className="searchLabel">Расположение</label>
          <input
            className="searchInput searchInputAddress"
            type="text"
            id="address"
			placeholder='Город, улица'
            value={address}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
          />
        </div>
        <div className="searchBlock">
          <label className="searchLabel">Тип жилья</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === 'sale' ? "searchButtonActive" : "searchButton"}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Продажа
            </button>
            <button
              type="button"
              className={type === 'rent' ? "searchButtonActive" : "searchButton"}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Съем
            </button>
            <button
              type="button"
              className={!type ? "searchButtonActive" : "searchButton"}
              id="type"
              value={null}
              onClick={onMutate}
            >
              Все
            </button>
          </div>
        </div>
        <div className="searchBlock">
          <label className="searchLabel">Цена (руб)</label>
          <div className="formButtons">
            <input
              className="searchInput searchInputAddress searchInputSmall"
              type="number"
              id="low_price"
              value={low_price}
			  placeholder='500'
              onChange={onMutate}
              min='50'
			  max='1000000000'
            />
            <div className="tire">
              <span>-</span>
            </div>
            <input
              className="searchInput searchInputAddress searchInputSmall"
              type="number"
              id="high_price"
              value={high_price}
			  placeholder='1500'
              onChange={onMutate}
              min='50'
			  max='1000000000'
            />
          </div>
        </div>
        <div className="searchBlock">
          <div className="formButtons">
            <button
              type="submit"
              className="searchButtonActive submitButton"
                onClick={onSubmit}
            >
              Найти
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SearchBox;

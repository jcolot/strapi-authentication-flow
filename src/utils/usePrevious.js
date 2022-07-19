/**
 * Save previous props value
 *
 * @param  {object} value   Any value
 *
 * @return {object} Returns previous value
 */

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
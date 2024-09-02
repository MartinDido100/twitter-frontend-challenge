import { useCallback,useRef } from "react";
import { useAppDispatch,useAppSelector } from "../redux/hooks";
import { setLastPost } from "../redux/user";
import { LIMIT } from "../util/Constants";

export const useInfiniteScroll = (loading: boolean): ((node: Element | null) => void) => {
    const feed = useAppSelector((state) => state.user.feed);
    const length = useAppSelector((state) => state.user.length);
    const dispatch = useAppDispatch()
    const observer = useRef<IntersectionObserver | null>(null);
    return useCallback((node: Element | null) => {
        if (loading) return;
        if(length < LIMIT) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                dispatch(setLastPost(feed[length-1].id))
            }
        });

        if (node) observer.current.observe(node);
    },[loading,length,feed]);
};
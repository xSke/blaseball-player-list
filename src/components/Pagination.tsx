import clsx from "clsx";

export interface PaginationProps {
    pageIndex: number;
    pageCount: number;
    gotoPage: (page: number) => void;
}

function Pagination(props: PaginationProps): JSX.Element | null {
    const canGoPrev = props.pageIndex > 0;
    const canGoNext = props.pageIndex < props.pageCount - 1;

    const pageIndices = [];
    for (let i = 0; i < props.pageCount; i++) pageIndices.push(i);

    if (props.pageCount <= 1) return null;

    return (
        <nav>
            <ul className="pagination">
                <li className={clsx("page-item", !canGoPrev && "disabled")}>
                    <a
                        className="page-link"
                        href="#"
                        aria-label="Previous"
                        aria-disabled={!canGoPrev}
                        tabIndex={canGoPrev ? undefined : -1}
                        onClick={() => props.gotoPage(props.pageIndex - 1)}
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                {pageIndices.map((idx) => (
                    <li
                        key={idx}
                        className={clsx(
                            "page-item",
                            props.pageIndex === idx && "active"
                        )}
                    >
                        <a
                            className="page-link"
                            href="#"
                            onClick={() => props.gotoPage(idx)}
                        >
                            {idx + 1}
                        </a>
                    </li>
                ))}
                <li className={clsx("page-item", !canGoNext && "disabled")}>
                    <a
                        className="page-link"
                        href="#"
                        aria-label="Next"
                        aria-disabled={!canGoNext}
                        tabIndex={canGoNext ? undefined : -1}
                        onClick={() => props.gotoPage(props.pageIndex + 1)}
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;

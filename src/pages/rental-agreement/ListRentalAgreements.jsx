import SectionTop from "../../ui/SectionTop"
import RentalAgreements from "../../features/rental-agreement/RentalAgreements"
import RentalAgreementsTable from "../../features/rental-agreement/RentalAgreementsTable"

import AddRentalAgreeMent from "../../features/rental-agreement/AddRentalAgreeMent"
import ViewToggleButton from "../../ui/ViewToggleButton";
import { useSearchParams } from "react-router-dom";
import useGetInfiteRentalAgreementList from "../../features/rental-agreement/useGetInfiniteRentalAgreementList";
import { useCallback, useRef } from "react"
import { useEffect } from "react"
import ExtraFilters from "../../ui/ExtraFilters"
function ListRentalAgreements() {
    // const { agreements, isLoading, error } = useGetRentalAgreementList(true);
    const { agreements: data, isLoading: isLoadingInfinite, error: errorInfinite, fetchNextPage, hasNextPage, isFetchingNextPage, totalSize } = useGetInfiteRentalAgreementList();
    const [searchParams] = useSearchParams();
    const viewType = searchParams.get("viewType") || "card";
    const containerRef = useRef(null);


    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage =
            (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);
    const containerHeight = data?.length > 10 ? "100vh" : "auto";

    return (
        <div className="sectionContainer">
            <SectionTop heading="Rental Agreements" />
            <section className="sectionStyles" ref={containerRef}
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    height: containerHeight,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}

            >
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap"
                }}>
                    <ExtraFilters
                        buttonOptions={[
                            { label: "Active", value: "ACTIVE" },
                            { label: "Inactive", value: "INACTIVE" },
                            {
                                label: "Draft",
                                value: `DRAFT`,
                            },
                        ]}
                        totalSize={totalSize}
                    />
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <AddRentalAgreeMent>
                            <button style={{
                                backgroundColor: "blue",
                                border: "1px solid green",
                                borderRadius: "5px",
                                color: "white",
                                padding: "0.5rem 1rem"
                            }} className="NormalButton">
                                Add Rental Agreement
                            </button>
                        </AddRentalAgreeMent>
                        <ViewToggleButton
                            defaultView="card"
                            viewParamName="viewType"
                        />
                    </div>
                </div>
                {viewType === "card" ? (
                    <RentalAgreements isLoading={isLoadingInfinite} error={errorInfinite} data={data} isFetchingNextPage={isFetchingNextPage} />
                ) : (
                    <RentalAgreementsTable isLoading={isLoadingInfinite} error={errorInfinite} data={data} isFetchingNextPage={isFetchingNextPage} />
                )}
            </section>
        </div>
    )
}

export default ListRentalAgreements

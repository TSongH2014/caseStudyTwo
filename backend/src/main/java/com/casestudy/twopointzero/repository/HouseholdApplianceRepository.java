package com.casestudy.twopointzero.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.casestudy.twopointzero.model.HouseholdAppliance;

@Repository
public interface HouseholdApplianceRepository extends JpaRepository<HouseholdAppliance, Long> {
	
	@Query(value = "SELECT * "
			+ "FROM householdappliance h WHERE "
			+ "h.brand LIKE %?1% AND "
			+ "h.model LIKE %?2% AND "
			+ "h.serial_number LIKE %?3% AND "
			+ "h.status LIKE %?4% AND "
			+ "h.date_bought\\:\\:text LIKE %?5%"
			, nativeQuery = true)
	public List<HouseholdAppliance> search2(Optional<String> brand, Optional<String> model, Optional<String> serialNumber, Optional<String> status, Optional<String> dateBought);
	
}
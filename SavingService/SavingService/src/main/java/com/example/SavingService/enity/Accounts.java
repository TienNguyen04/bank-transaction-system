//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.example.SavingService.enity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "accounts",
        schema = "account_service"
)
public class Accounts {
    @Id
    @Column(
            name = "id"
    )
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;
    @Column(
            name = "account_number"
    )
    private String accountNumber;
    @Column(
            name = "user_id"
    )
    private int userId;
    @Column(
            name = "balance"
    )
    private BigDecimal balance;
    @Column(
            name = "account_type"
    )
    private String accountType;
    @Column(
            name = "currency"
    )
    private String currency;
    @Column(
            name = "status"
    )
    private String status;
    @Column(
            name = "created_at"
    )
    private LocalDateTime createdAt;
    @Column(
            name = "updated_at"
    )
    private LocalDateTime updatedAt;
    @Column(name ="term")
    private String term;

    public Long getId() {
        return this.id;
    }

    public String getAccountNumber() {
        return this.accountNumber;
    }

    public int getUserId() {
        return this.userId;
    }

    public BigDecimal getBalance() {
        return this.balance;
    }

    public String getAccountType() {
        return this.accountType;
    }

    public String getCurrency() {
        return this.currency;
    }

    public String getStatus() {
        return this.status;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }
    public String getTerm() {
        return this.term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public void setAccountNumber(final String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public void setUserId(final int userId) {
        this.userId = userId;
    }

    public void setBalance(final BigDecimal balance) {
        this.balance = balance;
    }

    public void setAccountType(final String accountType) {
        this.accountType = accountType;
    }

    public void setCurrency(final String currency) {
        this.currency = currency;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public void setCreatedAt(final LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(final LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean equals(final Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof Accounts)) {
            return false;
        } else {
            Accounts other = (Accounts)o;
            if (!other.canEqual(this)) {
                return false;
            } else if (this.getUserId() != other.getUserId()) {
                return false;
            } else {
                Object this$id = this.getId();
                Object other$id = other.getId();
                if (this$id == null) {
                    if (other$id != null) {
                        return false;
                    }
                } else if (!this$id.equals(other$id)) {
                    return false;
                }

                Object this$accountNumber = this.getAccountNumber();
                Object other$accountNumber = other.getAccountNumber();
                if (this$accountNumber == null) {
                    if (other$accountNumber != null) {
                        return false;
                    }
                } else if (!this$accountNumber.equals(other$accountNumber)) {
                    return false;
                }

                Object this$balance = this.getBalance();
                Object other$balance = other.getBalance();
                if (this$balance == null) {
                    if (other$balance != null) {
                        return false;
                    }
                } else if (!this$balance.equals(other$balance)) {
                    return false;
                }

                Object this$accountType = this.getAccountType();
                Object other$accountType = other.getAccountType();
                if (this$accountType == null) {
                    if (other$accountType != null) {
                        return false;
                    }
                } else if (!this$accountType.equals(other$accountType)) {
                    return false;
                }

                Object this$currency = this.getCurrency();
                Object other$currency = other.getCurrency();
                if (this$currency == null) {
                    if (other$currency != null) {
                        return false;
                    }
                } else if (!this$currency.equals(other$currency)) {
                    return false;
                }

                Object this$status = this.getStatus();
                Object other$status = other.getStatus();
                if (this$status == null) {
                    if (other$status != null) {
                        return false;
                    }
                } else if (!this$status.equals(other$status)) {
                    return false;
                }

                Object this$createdAt = this.getCreatedAt();
                Object other$createdAt = other.getCreatedAt();
                if (this$createdAt == null) {
                    if (other$createdAt != null) {
                        return false;
                    }
                } else if (!this$createdAt.equals(other$createdAt)) {
                    return false;
                }

                Object this$updatedAt = this.getUpdatedAt();
                Object other$updatedAt = other.getUpdatedAt();
                if (this$updatedAt == null) {
                    if (other$updatedAt != null) {
                        return false;
                    }
                } else if (!this$updatedAt.equals(other$updatedAt)) {
                    return false;
                }

                return true;
            }
        }
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Accounts;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * 59 + this.getUserId();
        Object $id = this.getId();
        result = result * 59 + ($id == null ? 43 : $id.hashCode());
        Object $accountNumber = this.getAccountNumber();
        result = result * 59 + ($accountNumber == null ? 43 : $accountNumber.hashCode());
        Object $balance = this.getBalance();
        result = result * 59 + ($balance == null ? 43 : $balance.hashCode());
        Object $accountType = this.getAccountType();
        result = result * 59 + ($accountType == null ? 43 : $accountType.hashCode());
        Object $currency = this.getCurrency();
        result = result * 59 + ($currency == null ? 43 : $currency.hashCode());
        Object $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        Object $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : $createdAt.hashCode());
        Object $updatedAt = this.getUpdatedAt();
        result = result * 59 + ($updatedAt == null ? 43 : $updatedAt.hashCode());
        return result;
    }

    public String toString() {
        Long var10000 = this.getId();
        return "Accounts(id=" + var10000 + ", accountNumber=" + this.getAccountNumber() + ", userId=" + this.getUserId() + ", balance=" + String.valueOf(this.getBalance()) + ", accountType=" + this.getAccountType() + ", currency=" + this.getCurrency() + ", status=" + this.getStatus() + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", updatedAt=" + String.valueOf(this.getUpdatedAt()) + ")";
    }

    public Accounts(final Long id, final String accountNumber, final int userId, final BigDecimal balance, final String accountType, final String currency, final String status, final LocalDateTime createdAt, final LocalDateTime updatedAt) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.userId = userId;
        this.balance = balance;
        this.accountType = accountType;
        this.currency = currency;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Accounts() {
    }
}
